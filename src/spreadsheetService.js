export function writeToSpreadsheet(objArray = []) {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();

    const table = objArray.map((x) => [
      x.date,
      `=HYPERLINK("https://${x.subscriber.url}","${x.subscriber.name}")`,
      x.channel,
    ]);

    sheet.insertRowsAfter(1, objArray.length);
    const range = sheet.getRange(2, 1, objArray.length, 3);
    range.setValues(table);
    console.log(`Added ${objArray.length} new rows to spreadsheet!`);
  } catch (error) {
    console.error(`Error writing to spreadsheet: ${error.message}`);
  }
}
