// import { downloadDriveVideo, extractAudioFromVideo, transcribeAudio } from "./speech.service.js";
// import fs from "fs/promises";


// export const transcribeDriveVideo = async (driveLink) => {
//   let videoPath = "";
//   let audioPath = "";

//   try {
//     videoPath = await downloadDriveVideo(driveLink);
//     audioPath = await extractAudioFromVideo(videoPath);
//     const transcript = await transcribeAudio(audioPath);

//     return transcript;
//   } catch (error) {
//     console.error("Drive video transcription failed:", error.message);
//     return "";
//   } finally {
//     if (videoPath) {
//       await fs.unlink(videoPath).catch(() => {});
//     }
//     if (audioPath) {
//       await fs.unlink(audioPath).catch(() => {});
//     }
//   }
// };
