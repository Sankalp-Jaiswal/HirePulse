import { GoogleSpreadsheet } from "google-spreadsheet";

export const parseGoogleSheet = async (sheetUrl) => {
  const sheetId = sheetUrl.split("/d/")[1].split("/")[0];
  const doc = new GoogleSpreadsheet(sheetId);

  await doc.useAnonymousAccess();
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  return await sheet.getRows();
};
// sheet should be shared with "Anyone with the link can view" for this to work without authentication.