import prisma from "../utils/prisma.js";
import uploadFile, { getSignedVideoUrl, getVideoStream } from "../utils/upload.js";
import { extractAudio } from "../utils/extractAudio.js";
import { transcribeAudio } from "../utils/voice.js";
import embedText from "../utils/embed.js";
import fs from "fs";


export const addLecture = async (req, res) => {
    let { title, pricePerMinute, duration, courseId, videoUrl } = req.body;
    let transcript = "";

    try {
        if (req.file) {
            console.log("Processing uploaded video file:", req.file.path);
            const videoPath = req.file.path;

            // 1. Extract Audio
            // extractAudio expects validation of paths internally or returns path? 
            // checking videoPipeline, it returns audioPath.
            const audioPath = await extractAudio(videoPath, req.file.filename + "_audio");

            // 2. Upload Video to Cloud
            // This returns the Key. Assuming this is sufficient for now.
            videoUrl = await uploadFile(videoPath);

            // 3. Transcribe Audio
            // transcribeAudio likely handles the file path. videoPipeline passed "uploads/lectures/..."
            // We should use the absolute path or relative path as expected by transcribeAudio
            // videoPipeline used: `uploads/lectures/${req.file.filename}_audio.mp3`
            const audioUrlLocal = `uploads/lectures/${req.file.filename}_audio.mp3`;
            transcript = await transcribeAudio(audioUrlLocal);

            // 4. Create Embeddings
            await embedText(transcript);

            // Cleanup
            fs.unlinkSync(videoPath);
            fs.unlinkSync(audioPath);
        }

        const lecture = await prisma.lecture.create({
            data: {
                title,
                pricePerMinute: parseFloat(pricePerMinute || 0),
                duration: parseInt(duration || 0),
                courseId,
                videoUrl,
                transcript,
            },
        });
        return res.sendResponse(201, true, "Lecture entry created successfully", lecture);
    } catch (error) {
        console.error("Add Lecture Error:", error);
        // Attempt cleanup if failed
        if (req.file && fs.existsSync(req.file.path)) {
            try { fs.unlinkSync(req.file.path); } catch (e) { }
        }
        return res.sendResponse(500, false, "Failed to create lecture entry", { error: error.message });
    }
};

export const getCourseLectures = async (req, res) => {
    const { courseId } = req.params;

    try {
        const lectures = await prisma.lecture.findMany({
            where: { courseId },
        });

        // Generate signed URLs for each lecture
        const lecturesWithUrls = await Promise.all(lectures.map(async (lecture) => {
            if (lecture.videoUrl && !lecture.videoUrl.startsWith('http')) {
                // Assuming it's a key, generate signed URL
                try {
                    const signedUrl = await getSignedVideoUrl(lecture.videoUrl);
                    return { ...lecture, videoUrl: signedUrl };
                } catch (e) {
                    console.error(`Failed to sign URL for lecture ${lecture.id}:`, e);
                    return lecture;
                }
            }
            return lecture;
        }));

        return res.sendResponse(200, true, "Lectures fetched successfully", lecturesWithUrls);
    } catch (error) {
        return res.sendResponse(500, false, "Failed to fetch lectures", { error: error.message });
    }
};

export const updateLecture = async (req, res) => {
    const { id } = req.params;
    const { title, pricePerMinute, duration, videoUrl } = req.body;

    try {
        const lecture = await prisma.lecture.update({
            where: { id },
            data: {
                title,
                pricePerMinute: pricePerMinute ? parseFloat(pricePerMinute) : undefined,
                duration: duration ? parseInt(duration) : undefined,
                videoUrl,
            },
        });
        return res.sendResponse(200, true, "Lecture updated successfully", lecture);
    } catch (error) {
        return res.sendResponse(500, false, "Failed to update lecture", { error: error.message });
    }
};

export const deleteLecture = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.lecture.delete({
            where: { id },
        });
        return res.sendResponse(200, true, "Lecture deleted successfully");
    } catch (error) {
        return res.sendResponse(500, false, "Failed to delete lecture", { error: error.message });
    }
};

export const previewLecture = async (req, res) => {
    const { id } = req.params;
    const teacherEmail = req.user?.email;

    console.log(`[Preview] Request for lecture: ${id}, TeacherEmail: ${teacherEmail}`);

    try {
        const teacher = await prisma.teacher.findUnique({
            where: { email: teacherEmail }
        });

        if (!teacher) {
            console.log("[Preview] Teacher not found for email:", teacherEmail);
            return res.sendResponse(404, false, "Teacher profile not found");
        }

        const teacherId = teacher.id;

        const lecture = await prisma.lecture.findUnique({
            where: { id },
            include: { course: true },
        });

        if (!lecture) {
            console.log("[Preview] Lecture not found");
            return res.sendResponse(404, false, "Lecture not found");
        }

        // Verify ownership
        if (lecture.course.teacherId !== teacherId) {
            console.log(`[Preview] Unauthorized. Owner: ${lecture.course.teacherId}, Requestor: ${teacherId}`);
            return res.sendResponse(403, false, "Unauthorized to preview this lecture");
        }

        const videoUrl = lecture.videoUrl;

        if (!videoUrl) {
            return res.sendResponse(404, false, "Video content not found");
        }

        if (videoUrl.startsWith("http")) {
            console.log("[Preview] Redirecting to external URL");
            return res.redirect(videoUrl);
        }

        // Generate Signed URL and Redirect
        console.log("[Preview] Generating Signed URL for redirect...");
        try {
            const signedUrl = await getSignedVideoUrl(videoUrl, 3600); // 1 hour validity
            console.log(`[Preview] Redirecting to signed URL: ${signedUrl.substring(0, 50)}...`);
            return res.redirect(signedUrl);
        } catch (signError) {
            console.error("[Preview] Failed to sign URL:", signError);
            return res.sendResponse(500, false, "Failed to generate video link");
        }
    } catch (error) {
        console.error("Preview lecture error:", error);
        if (!res.headersSent) {
            return res.sendResponse(500, false, "Failed to preview lecture", { error: error.message });
        }
    }
};
