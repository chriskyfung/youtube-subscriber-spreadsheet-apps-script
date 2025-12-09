import {
  fixHyperlinkUrl,
  cleanDisplayText,
  sanitizeForSpreadsheet,
} from './utils';

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
      `=HYPERLINK("${sanitizeForSpreadsheet(
        x.subscriber.url,
      )}","${sanitizeForSpreadsheet(x.subscriber.name)}")`,
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

/**
 * Fixes problematic YouTube subscriber links in Column B of the active spreadsheet.
 * It extracts the URL from HYPERLINK formulas, cleans them, and updates the cells.
 */
export function fixSubscriberLinks() {
  try {
    const sheet = SpreadsheetApp.getActiveSheet();
    const range = sheet.getRange('B1:B' + (sheet.getLastRow() || 1));
    const formulas = range.getFormulas();

    const updatedFormulas = formulas.map((row) => {
      const formula = row[0];
      if (formula.startsWith('=HYPERLINK(')) {
        // Extract the URL and display text from the HYPERLINK formula
        const hyperlinkRegex = /^=HYPERLINK\("([^"]+)"(?:,"([^"]+)")?\)$/i;
        const match = formula.match(hyperlinkRegex);

        if (match) {
          const originalUrl = match[1];
          const originalDisplayText = match[2]; // This will be undefined if not present
          const cleanedUrl = fixHyperlinkUrl(originalUrl);
          const displayText =
            originalDisplayText !== undefined
              ? originalDisplayText
              : cleanedUrl;
          const cleanedDisplayText = cleanDisplayText(displayText);
          return [
            `=HYPERLINK("${sanitizeForSpreadsheet(cleanedUrl)}","${sanitizeForSpreadsheet(cleanedDisplayText)}")`,
          ];
        }
      }
      return [formula]; // Return original formula (as a 2D array) if not a hyperlink or no match
    });

    range.setFormulas(updatedFormulas);
    console.log('Subscriber links in Column B have been fixed.');
  } catch (error) {
    console.error(`Error fixing subscriber links: ${error.message}`);
    throw error;
  }
}
