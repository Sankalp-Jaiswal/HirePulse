export const normalizeDriveLink = (url) => {
  try {
    if (!url || !url.includes("drive.google.com")) return url;

    // Try URL search params first (handles open?id=... and similar)
    try {
      const u = new URL(url);
      const idFromParams = u.searchParams.get("id");
      if (idFromParams) return `https://drive.google.com/uc?export=download&id=${idFromParams}`;
    } catch (e) {
      // ignore invalid URL parsing and fallback to regex
    }

    // Common path formats: /d/:id/ or /file/d/:id/
    const pathMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) return `https://drive.google.com/uc?export=download&id=${pathMatch[1]}`;

    // Query-style id parameter fallback
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;

    // As a last resort, try to find any 33+ char-looking Drive id in the string
    const genericMatch = url.match(/([a-zA-Z0-9_-]{20,})/);
    if (genericMatch) return `https://drive.google.com/uc?export=download&id=${genericMatch[1]}`;

    return url;
  } catch (err) {
    return url;
  }
};