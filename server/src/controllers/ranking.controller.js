import { parseExcel } from "../services/excel.service.js";
import { parseGoogleSheet } from "../services/googleSheet.service.js";
import { fetchResume } from "../services/resume.service.js";
import { extractText } from "../services/parser.service.js";
import { rankCandidates } from "../services/ranking.service.js";
import { transcribeDriveVideo } from "../services/transcribe.service.js";
import fetch from "node-fetch";

const res = await fetch("https://ipapi.co/json/");
const data = await res.json();
console.log("Server Location:", data);


export const rankCandidatesController = async (req, res) => {
  const { jobDescription, sheetLink } = req.body;

  let candidates = [];

  if (sheetLink) {
    candidates = await parseGoogleSheet(sheetLink);
  } else {
    candidates = parseExcel(req.file.path);
  }

  for (const [index, c] of candidates.entries()) {
    const candidateLabel =
      c.Name || c.Email || c.Resume_Link || `candidate_${index + 1}`;
    c.videoTranscript = "";
    c.resumeText = "";

    // if (!c.Demo_Video_Link) {
    //   console.log(
    //     `[Transcript] [${candidateLabel}] No Demo_Video_Link provided; skipping.`,
    //   );
    // } else {
    //   try {
    //     let transcript = "";
    //     transcript = await transcribeDriveVideo(c.Demo_Video_Link);
    //     c.videoTranscript = transcript;

    //   } catch (err) {
    //     console.error(
    //       `[Transcript] [${candidateLabel}] Failed:`,
    //       err?.message || String(err),
    //     );
    //   }
    // }

    if (!c.Resume_Link) {
      console.log("Skipping resume parsing, missing Resume_Link");
      continue;
    }

    try {
      const { buffer, contentType } = await fetchResume(c.Resume_Link);

      // Accept PDF, Word docs, and octet-stream (Google Drive exports)
      const ct = (contentType || "").toLowerCase();
      if (
        ct.includes("pdf") ||
        ct.includes("officedocument") ||
        ct.includes("msword") ||
        ct.includes("word") ||
        ct.includes("octet-stream")
      ) {
        c.resumeText = await extractText(buffer);
      } else {
        console.log(
          "Skipping resume parsing, unsupported content-type:",
          contentType,
        );
      }
    } catch (err) {
      console.error("Resume parsing failed:", err.message);
    }
  }

  const ranked = await rankCandidates(jobDescription, candidates);
  console.log("Ranking completed. Sample ranked candidate:", ranked[0].score);
  res.json(ranked);
};
