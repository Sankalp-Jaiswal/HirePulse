import { GoogleSpreadsheet } from "google-spreadsheet";

export const parseGoogleSheet = async (sheetUrl) => {
  const sheetId = sheetUrl.split("/d/")[1].split("/")[0];
  const doc = new GoogleSpreadsheet(sheetId, {
    apiKey: process.env.GOOGLE_API_KEY,
  });
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  return rows.map((row) => row.toObject());
};
// sheet should be shared with "Anyone with the link can view" for this to work without authentication.
