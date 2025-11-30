/**
 * @typedef {object} SubscriberInfo
 * @property {string} id The Gmail thread ID.
 * @property {Date} date The date of the email.
 * @property {string} channel The YouTube channel name this notification is for.
 * @property {{url: string, name: string}} subscriber The subscriber's information.
 */

/**
 * Writes an array of subscriber objects to the active spreadsheet.
 *
 * @param {SubscriberInfo[]} [objArray=[]] An array of subscriber objects.
 */
export function writeToSpreadsheet(objArray = []) {
  if (objArray.length === 0) {
    console.log('No new rows to add.');
    return;
  }
  try {
    const sheet = SpreadsheetApp.getActiveSheet();

    const table = objArray.map((x) => [
      x.date,
      `=HYPERLINK("${x.subscriber.url}","${x.subscriber.name}")`,
      x.channel,
    ]);

    sheet.insertRowsAfter(1, objArray.length);
    const range = sheet.getRange(2, 1, objArray.length, 3);
    range.setValues(table);
    console.log(`Added ${objArray.length} new rows to spreadsheet!`);
  } catch (error) {
    console.error(`Error writing to spreadsheet: ${error.message}`);
    throw error;
  }
}
