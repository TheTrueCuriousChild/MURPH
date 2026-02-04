import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

export const extractAudio = (videoPath, outputName) => {
  return new Promise((resolve, reject) => {
    const audioPath = path.resolve(`uploads/lectures/${outputName}.mp3`);

    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("libmp3lame")
      .on("end", () => resolve(audioPath))
      .on("error", reject)
      .run();
  });
};
