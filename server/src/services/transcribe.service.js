import { downloadDriveVideo, extractAudioFromVideo, transcribeAudio } from "./speech.service.js";
import fs from "fs";


export const transcribeDriveVideo = async (driveLink) => {
  try {
    const videoPath = await downloadDriveVideo(driveLink);
    const audioPath = await extractAudioFromVideo(videoPath);
    const transcript = await transcribeAudio(audioPath);

    // Cleanup temp files
    fs.unlinkSync(videoPath);
    fs.unlinkSync(audioPath);

    return transcript;

  } catch (error) {
    console.error("Drive video transcription failed:", error.message);
    return "";
  }
};
