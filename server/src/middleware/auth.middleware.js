import { verifyGoogleToken } from "../auth/googleAuth.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new Error("Unauthorized");

    req.user = await verifyGoogleToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
};
