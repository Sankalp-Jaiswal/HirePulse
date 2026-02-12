import axios from "axios";
import http from "http";
import https from "https";
import { normalizeDriveLink } from "../utils/drive.util.js";

const resumeHttpClient = axios.create({
  timeout: 12000,
  validateStatus: null,
  maxRedirects: 5,
  httpAgent: new http.Agent({ keepAlive: true, maxSockets: 20 }),
  httpsAgent: new https.Agent({ keepAlive: true, maxSockets: 20 }),
});

export const fetchResume = async (link) => {
  const url = normalizeDriveLink(link);
  // console.log("Fetching resume:", { original: link, normalized: url });

  try {
    const res = await resumeHttpClient.get(url, {
      responseType: "arraybuffer",
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
