import { uploadSingle } from "../utils/multer.js";
import uploadFile from "../utils/upload.js";
import { extractAudio } from "../utils/extractAudio.js";
import { transcribeAudio } from "../utils/voice.js";
import embedText from "../utils/embed.js";
import { initPinecone, upsertEmbeddings } from "../utils/pinecone.js";
import fs from "fs";

export const uploadLecture = (req, res) => {
  uploadSingle("lecture")(req, res, async (err) => {
    if (err) return res.sendResponse(500, false, "File upload failed");
    if (!req.file) return res.sendResponse(400, false, "No file provided");

    try {
      const videoPath = req.file.path;
      const audioPath = await extractAudio(videoPath, req.file.filename + "_audio");
      const videoKey = await uploadFile(videoPath);

      const audioUrl = `uploads/lectures/${req.file.filename}_audio.mp3`;
      const transcript = await transcribeAudio(audioUrl);
      const embeddings = await embedText(transcript);

      // Initialize Pinecone and upsert embeddings
      await initPinecone();
      await upsertEmbeddings(embeddings);

      fs.unlinkSync(videoPath);
      fs.unlinkSync(audioPath);

      return res.sendResponse(200, true, "Lecture processed successfully");

    } catch (error) {
      console.log(error);
      return res.sendResponse(500, false, "Processing pipeline failed", {
        error: error.message
      });
    }
  });
};
