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

const fetchBinary = (url) =>
  resumeHttpClient.get(url, {
    responseType: "arraybuffer",
    headers: {
      Accept: "*/*",
      "User-Agent": "Mozilla/5.0",
    },
  });

const decodeHtml = (value = "") => value.replaceAll("&amp;", "&");

const extractDriveConfirmUrl = (html = "") => {
  const hrefMatch = html.match(/href="(\/uc\?export=download[^"]+)"/i);
  if (hrefMatch?.[1]) {
    return `https://drive.google.com${decodeHtml(hrefMatch[1])}`;
  }

  const actionMatch = html.match(/action="(https:\/\/drive\.google\.com\/uc\?export=download[^"]+)"/i);
  const confirmMatch = html.match(/name="confirm" value="([^"]+)"/i);
  const idMatch = html.match(/name="id" value="([^"]+)"/i);

  if (actionMatch?.[1] && confirmMatch?.[1] && idMatch?.[1]) {
    const confirmUrl = new URL(decodeHtml(actionMatch[1]));
    confirmUrl.searchParams.set("confirm", confirmMatch[1]);
    confirmUrl.searchParams.set("id", idMatch[1]);
    return confirmUrl.toString();
  }

  return "";
};

export const fetchResume = async (link) => {
  const url = normalizeDriveLink(link);
  // console.log("Fetching resume:", { original: link, normalized: url });

  try {
    let res = await fetchBinary(url);
    let contentType = res.headers["content-type"] || "";

    // console.log("Resume response status:", res.status, "content-type:", contentType);

    if (res.status !== 200) {
      throw new Error(`Failed to fetch resume: ${res.status} ${res.statusText || ""}`);
    }

    // Google Drive may return an HTML virus-scan/confirm page before the real file.
    if (contentType.toLowerCase().includes("text/html") && url.includes("drive.google.com")) {
      const firstHtml = Buffer.from(res.data).toString("utf8");
      const confirmUrl = extractDriveConfirmUrl(firstHtml);

      if (confirmUrl) {
        const confirmedRes = await fetchBinary(confirmUrl);
        res = confirmedRes;
        contentType = res.headers["content-type"] || "";

        if (res.status !== 200) {
          throw new Error(`Failed to fetch resume after Drive confirm: ${res.status} ${res.statusText || ""}`);
        }
      }

      if ((contentType || "").toLowerCase().includes("text/html")) {
        const html = Buffer.from(res.data).toString("utf8");
        const htmlLower = html.toLowerCase();
        if (
          htmlLower.includes("you need access") ||
          htmlLower.includes("request access") ||
          htmlLower.includes("sign in")
        ) {
          throw new Error("Resume link is not publicly accessible. Share it as 'Anyone with the link can view'.");
        }
      }
    }

    const finalUrl = res.request?.res?.responseUrl || url;
    return { buffer: res.data, contentType, finalUrl };
    
    
  } catch (error) {
    console.error("Failed fetching resume:", url, error.message);
    throw error;
  }
};
