import { verifyGoogleToken } from "../auth/googleAuth.js";

export const authMiddleware = async (req, res, next) => {
  res.send("Server is running successfully 🚀");
  try {
    const token = req.headers.authorization?.split(" ")[1];
    // console.log("Auth header:", req.headers.authorization?.substring(0, 20) + "...");
    // console.log("Token extracted:", token ? "✓ Found" : "✗ Missing");
    
    if (!token) throw new Error("Unauthorized");

    req.user = await verifyGoogleToken(token);
    // console.log("✓ Token verified for user:", req.user.email);
    next();
  } catch (error) {
    console.error("❌ Auth error:", error.message);
    res.status(401).json({ error: "Invalid token", details: error.message });
  }
};

