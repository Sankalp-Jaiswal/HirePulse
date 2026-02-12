import fs from "fs";
import path from "path";
import axios from "axios";
import ffmpeg from "fluent-ffmpeg";
import ffmpegPath from "ffmpeg-static";
import { normalizeDriveLink } from "../utils/drive.util.js";

ffmpeg.setFfmpegPath(ffmpegPath);

import { spawn } from "child_process";

export const transcribeAudio = (audioPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(audioPath);
    const baseName = path.basename(audioPath, ".wav");

    const ffmpegPath =
      "C:\\Users\\ASUS\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin";

    const env = {
      ...process.env,
      PATH: `${process.env.PATH};${ffmpegPath}`
    };

    const processWhisper = spawn(
      "C:\\Users\\ASUS\\AppData\\Local\\Programs\\Python\\Python311\\python.exe",
      [
        "-m",
        "whisper",
        audioPath,
        "--model",
        "base",
        "--output_format",
        "txt",
        "--output_dir",
        outputDir
      ],
      { env }
    );

    processWhisper.stderr.on("data", (data) => {
      console.error(`Whisper Error: ${data}`);
    });

    processWhisper.on("close", (code) => {
      if (code !== 0) {
        return reject(new Error(`Whisper exited with code ${code}`));
      }

      const outputTxtPath = path.join(outputDir, `${baseName}.txt`);

      if (!fs.existsSync(outputTxtPath)) {
        return reject(new Error("Transcript file not found"));
      }

      const transcript = fs.readFileSync(outputTxtPath, "utf-8");
      resolve(transcript.trim());
    });
  });
};



export const extractAudioFromVideo = (videoPath) => {
  return new Promise((resolve, reject) => {
    const audioPath = videoPath.replace(".mp4", ".wav");

    ffmpeg(videoPath)
      .audioChannels(1)
      .audioFrequency(16000)
      .format("wav")
      .save(audioPath)
      .on("end", () => resolve(audioPath))
      .on("error", reject);
  });
};

export const downloadDriveVideo = async (driveUrl) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY missing");
    }

    const fileIdMatch = driveUrl.match(/[-\w]{25,}/);
    if (!fileIdMatch) {
      throw new Error("Invalid Drive link");
    }

    const fileId = fileIdMatch[0];

    const downloadUrl =
      `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${process.env.GOOGLE_API_KEY}`;

    const outputPath = path.join(
      "uploads/audio",
      `video-${Date.now()}.mp4`
    );

    const response = await axios({
      method: "GET",
      url: downloadUrl,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", () => resolve(outputPath));
      writer.on("error", reject);
    });

  } catch (error) {
    console.error("Drive API download failed:", error.response?.data || error.message);
    throw error;
  }
};


