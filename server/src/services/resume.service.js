import axios from "axios";
import { normalizeDriveLink } from "../utils/drive.util.js";

export const fetchResume = async (link) => {
  const res = await axios.get(normalizeDriveLink(link), {
    responseType: "arraybuffer"
  });
  return res.data;
};