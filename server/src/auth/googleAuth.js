import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const verifyGoogleToken = async (token) => {
  try {
    console.log("Verifying token with GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    console.log("✓ Token verified:", payload.email);
    return payload;
  } catch (error) {
    console.error("❌ Token verification failed:", error.message);
    throw error;
  }
};

