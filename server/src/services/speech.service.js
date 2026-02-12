import fs from "fs";
import path from "path";
import axios from "axios";
import http from "http";
import https from "https";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { createClient } from "@deepgram/sdk";

ffmpeg.setFfmpegPath(ffmpegPath);

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const driveHttpClient = axios.create({
  timeout: 20000,
  responseType: "stream",
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 10 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 10 }),
});

export const transcribeAudio = async (audioPath) => {
  try {
    const audioBuffer = fs.readFileSync(audioPath);
    const response = await deepgram.listen.prerecorded.transcribeFile(audioBuffer, {
      model: "nova-2",
      smart_format: true,
    });

    if (!response?.result) {
      throw new Error("Deepgram returned empty result");
    }

    return response.result.results.channels[0].alternatives[0].transcript;
  } catch (error) {
    console.error("Deepgram transcription failed:", error.message || error);
    return "";
  }
};

export const extractAudioFromVideo = (videoPath) =>
  new Promise((resolve, reject) => {
    const audioPath = videoPath.replace(".mp4", ".wav");
    ffmpeg(videoPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .save(audioPath)
      .on("end", () => resolve(audioPath))
      .on("error", reject);
  });

export const downloadDriveVideo = async (driveUrl) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY missing");
    }

    const fileIdMatch = String(driveUrl || "").match(/[-\w]{25,}/);
    if (!fileIdMatch) {
      throw new Error("Invalid Drive link");
    }

    const fileId = fileIdMatch[0];
    const downloadUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.GOOGLE_API_KEY}`;

    const outputDir = path.join("uploads", "audio");
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, `video-${Date.now()}.mp4`);

    const response = await driveHttpClient.get(downloadUrl);
    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return await new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(outputPath));
      writer.on("error", reject);
    });
  } catch (error) {
    console.error("Drive API download failed:", error.response?.data || error.message);
    throw error;
  }
};
