export const normalizeDriveLink = (url) => {
  try {
    if (!url || typeof url !== "string") return url;
    const link = url.trim();

    // Google Docs document links should be exported as docx for downstream parsing.
    const docsMatch = link.match(/docs\.google\.com\/document\/(?:u\/\d+\/)?d\/([a-zA-Z0-9_-]+)/);
    if (docsMatch) {
      return `https://docs.google.com/document/d/${docsMatch[1]}/export?format=docx`;
    }

    if (!link.includes("drive.google.com")) return link;

    // Try URL search params first (handles open?id=... and similar)
    try {
      const u = new URL(link);
      const idFromParams = u.searchParams.get("id");
      if (idFromParams) return `https://drive.google.com/uc?export=download&id=${idFromParams}`;
    } catch (e) {
      // ignore invalid URL parsing and fallback to regex
    }

    // Common path formats: /d/:id/ or /file/d/:id/
    const pathMatch = link.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) return `https://drive.google.com/uc?export=download&id=${pathMatch[1]}`;

    // Query-style id parameter fallback
    const idMatch = link.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch) return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;

    // As a last resort, try to find any 33+ char-looking Drive id in the string
    const genericMatch = link.match(/([a-zA-Z0-9_-]{20,})/);
    if (genericMatch) return `https://drive.google.com/uc?export=download&id=${genericMatch[1]}`;

    return link;
  } catch (err) {
    return url;
  }
};
