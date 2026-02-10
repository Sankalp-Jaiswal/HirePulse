import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse"); // ← works with v1.1.1

export const extractText = async (buffer) => {
  try {
    // Check PDF signature
    if (buffer.slice(0, 4).toString("ascii") === "%PDF") {
      const data = await pdf(buffer);
      return data.text;
    }

    // DOCX
    const result = await mammoth.extractRawText({ buffer });
    return result.value;

  } catch (error) {
    console.error("Resume parsing failed:", error);
    return "";
  }
};
