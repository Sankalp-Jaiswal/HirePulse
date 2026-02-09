import pdf from "pdf-parse";
import mammoth from "mammoth";

export const extractText = async (buffer) => {
  try {
    if (buffer.slice(0, 4).toString() === "%PDF") {
      const data = await pdf(buffer);
      return data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    }
  } catch {
    return "";
  }
};
