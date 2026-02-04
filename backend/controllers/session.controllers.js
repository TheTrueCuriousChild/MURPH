import prisma from "../utils/prisma.js";
import { lockFunds, releaseAndDistributeFunds } from "../utils/wallet.service.js";
import { getVideoStream } from "../utils/upload.js";

/**
 * Serve lecture video by generating a signed URL
 * Only accessible if the user has an ACTIVE session for this lecture
 */
export const serveLectureVideo = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
                status: "ACTIVE",
            },
            include: {
                lecture: true,
            },
        });

        if (!session) {
            return res.sendResponse(403, false, "No active session found for this lecture");
        }

        const videoUrl = session.lecture.videoUrl;
        console.log(`[DEBUG] Attempting to serve video with key/URL: ${videoUrl} for session: ${sessionId}`);

        if (!videoUrl) {
            return res.sendResponse(404, false, "Video content not found for this lecture");
        }

        // If it's a full URL, we can't fetch it from B2 as a key
        if (videoUrl.startsWith("http")) {
            console.log(`[DEBUG] Found external URL, returning directly: ${videoUrl}`);
            return res.sendResponse(200, true, "External video URL returned", {
                videoUrl: videoUrl,
                type: "external"
            });
        }

        // Get the video stream from the private bucket
        const { stream, contentType, contentLength } = await getVideoStream(videoUrl);

        // Set response headers for streaming
        res.setHeader("Content-Type", contentType || "video/mp4");
        if (contentLength) {
            res.setHeader("Content-Length", contentLength);
        }
        res.setHeader("Accept-Ranges", "bytes");

        // Pipe the stream directly to the response
        stream.pipe(res);
    } catch (error) {
        console.error("Serve lecture video error:", error);
        // If headers are already sent, we can't send a JSON response
        if (!res.headersSent) {
            return res.sendResponse(500, false, "Failed to serve lecture video", {
                error: error.message,
            });
        }
    }
};

/**
 * Start a new lecture viewing session
 * Creates payment intent, milestone, and locks estimated funds
 */
export const startLectureSession = async (req, res) => {
    const { lectureId } = req.body;
    const userEmail = req.user.email;

    try {
        // Get lecture details
        const lecture = await prisma.lecture.findUnique({
            where: { id: lectureId },
            include: { course: true },
        });

        if (!lecture) {
            return res.sendResponse(404, false, "Lecture not found");
        }

        // Check if user already has an active session for this lecture
        const existingSession = await prisma.viewingSession.findFirst({
            where: {
                userEmail,
                lectureId,
                status: { in: ["ACTIVE", "PAUSED"] },
            },
        });

        if (existingSession) {
            return res.sendResponse(400, false, "You already have an active session for this lecture");
        }

        // Calculate lock amount
        // max(2 * avgViewingTime * pricePerMinute, duration * pricePerMinute)
        const avgViewingMinutes = (lecture.avgViewingTime || lecture.duration) / 60;
        const durationMinutes = lecture.duration / 60;
        const estimatedAmount1 = 2 * avgViewingMinutes * lecture.pricePerMinute;
        const estimatedAmount2 = durationMinutes * lecture.pricePerMinute;
        const lockAmount = Math.max(estimatedAmount1, estimatedAmount2);

        // Lock funds using custom wallet service
        const lockResult = await lockFunds(userEmail, lockAmount);

        if (!lockResult.success) {
            return res.sendResponse(400, false, "Failed to lock funds", {
                error: lockResult.message,
            });
        }

        // Create viewing session
        const session = await prisma.viewingSession.create({
            data: {
                userEmail,
                lectureId,
                paymentIntentId: "LOCAL_WALLET", // Mock ID for compatibility
                status: "ACTIVE",
                currentTimestamp: new Date(),
            },
        });

        // Create payment record
        await prisma.payment.create({
            data: {
                sessionId: session.id,
                paymentIntentId: "LOCAL_WALLET",
                amountLocked: lockAmount,
                status: "LOCKED",
                currency: "USDC",
            },
        });

        return res.sendResponse(200, true, "Session started successfully", {
            sessionId: session.id,
            lockAmount,
        });
    } catch (error) {
        console.error("Start session error:", error);
        return res.sendResponse(500, false, "Failed to start session", {
            error: error.message,
        });
    }
};

/**
 * Pause a viewing session
 * Updates total watch time
 */
export const pauseSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status !== "ACTIVE") {
            return res.sendResponse(400, false, "Session is not active");
        }

        // Calculate elapsed time
        const now = new Date();
        const elapsedSeconds = Math.floor((now - session.currentTimestamp) / 1000);

        // Update session
        const updatedSession = await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                totalWatchTime: session.totalWatchTime + elapsedSeconds,
                status: "PAUSED",
            },
        });

        return res.sendResponse(200, true, "Session paused successfully", {
            sessionId: updatedSession.id,
            totalWatchTime: updatedSession.totalWatchTime,
        });
    } catch (error) {
        console.error("Pause session error:", error);
        return res.sendResponse(500, false, "Failed to pause session", {
            error: error.message,
        });
    }
};

/**
 * Resume a paused viewing session
 * Resets current timestamp
 */
export const resumeSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status !== "PAUSED") {
            return res.sendResponse(400, false, "Session is not paused");
        }

        // Update session
        const updatedSession = await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                currentTimestamp: new Date(),
                status: "ACTIVE",
            },
        });

        return res.sendResponse(200, true, "Session resumed successfully", {
            sessionId: updatedSession.id,
        });
    } catch (error) {
        console.error("Resume session error:", error);
        return res.sendResponse(500, false, "Failed to resume session", {
            error: error.message,
        });
    }
};

/**
 * End a viewing session
 * Calculates final watch time, completes milestone, and updates lecture analytics
 */
export const endSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
            include: {
                lecture: {
                    include: {
                        course: true,
                    },
                },
                payment: true,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        if (session.status === "ENDED") {
            return res.sendResponse(400, false, "Session already ended");
        }

        // Calculate final watch time
        let finalWatchTime = session.totalWatchTime;
        if (session.status === "ACTIVE") {
            const now = new Date();
            const elapsedSeconds = Math.floor((now - session.currentTimestamp) / 1000);
            finalWatchTime += elapsedSeconds;
        }

        // Calculate charge (convert seconds to minutes)
        const watchMinutes = finalWatchTime / 60;
        const chargeAmount = watchMinutes * session.lecture.pricePerMinute;

        // Distribute funds using custom wallet service
        const distributionResult = await releaseAndDistributeFunds(
            userEmail,
            session.lecture.course.teacherEmail,
            session.payment.amountLocked,
            chargeAmount
        );

        if (!distributionResult.success) {
            console.error("Failed to distribute funds:", distributionResult.message);
            // Even if distribution fails, we should still try to end the session but log the error
        }

        // Update session
        await prisma.viewingSession.update({
            where: { id: sessionId },
            data: {
                totalWatchTime: finalWatchTime,
                status: "ENDED",
            },
        });

        // Update payment record
        await prisma.payment.update({
            where: { sessionId },
            data: {
                amountCharged: chargeAmount,
                status: "COMPLETED",
            },
        });

        // Create lecture access record
        await prisma.lectureAccess.create({
            data: {
                userEmail,
                lectureId: session.lectureId,
            },
        });

        // Update lecture's average viewing time
        const allSessions = await prisma.viewingSession.findMany({
            where: {
                lectureId: session.lectureId,
                status: "ENDED",
            },
        });

        const totalViewingTime = allSessions.reduce((sum, s) => sum + s.totalWatchTime, 0);
        const avgViewingTime = Math.floor(totalViewingTime / allSessions.length);

        await prisma.lecture.update({
            where: { id: session.lectureId },
            data: { avgViewingTime },
        });

        return res.sendResponse(200, true, "Session ended successfully", {
            sessionId,
            finalWatchTime,
            chargeAmount,
            watchMinutes: watchMinutes.toFixed(2),
        });
    } catch (error) {
        console.error("End session error:", error);
        return res.sendResponse(500, false, "Failed to end session", {
            error: error.message,
        });
    }
};

/**
 * Get session details
 */
export const getSession = async (req, res) => {
    const { sessionId } = req.params;
    const userEmail = req.user.email;

    try {
        const session = await prisma.viewingSession.findFirst({
            where: {
                id: sessionId,
                userEmail,
            },
            include: {
                lecture: true,
                payment: true,
            },
        });

        if (!session) {
            return res.sendResponse(404, false, "Session not found");
        }

        return res.sendResponse(200, true, "Session retrieved successfully", session);
    } catch (error) {
        console.error("Get session error:", error);
        return res.sendResponse(500, false, "Failed to get session", {
            error: error.message,
        });
    }
};



