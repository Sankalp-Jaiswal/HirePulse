export const normalizeDriveLink = (url) => {
  if (url.includes("drive.google.com")) {
    const id = url.split("/d/")[1]?.split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};