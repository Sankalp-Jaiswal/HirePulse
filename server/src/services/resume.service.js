import axios from "axios";
import { normalizeDriveLink } from "../utils/drive.util.js";

export const fetchResume = async (link) => {
  const url = normalizeDriveLink(link);
  // console.log("Fetching resume:", { original: link, normalized: url });

  try {
    const res = await axios.get(url, {
      responseType: "arraybuffer",
      validateStatus: null
    });

    const contentType = res.headers["content-type"] || "";
    // console.log("Resume response status:", res.status, "content-type:", contentType);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch resume: ${res.status} ${res.statusText || ""}`);
    }

    return { buffer: res.data, contentType };
    
    
  } catch (error) {
    console.error("Failed fetching resume:", url, error.message);
    throw error;
  }
};