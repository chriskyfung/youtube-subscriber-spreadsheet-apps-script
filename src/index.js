// @ts-ignore

import { LOCATES } from './constants';
import { getObjFromGmail, toTrash } from './gmailService';
import { writeToSpreadsheet, fixSubscriberLinks } from './spreadsheetService';

/**
 * Adds a custom menu to the Google Sheet when it is opened.
 * @see {@link https://developers.google.com/apps-script/guides/menus}
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('YouTube Subscriber Tools')
    .addItem('Fix Subscriber Links', 'fixLinksInSheet')
    .addToUi();
}

/**
 * The main function to be run in the Google Apps Script environment.
 * It iterates through the specified languages, retrieves subscriber information from Gmail,
 * writes the information to a spreadsheet, and moves the processed emails to the trash.
 * @see {@link https://developers.google.com/apps-script/reference/base/doc-comment-tag}
 */

function main() {
  try {
    LOCATES.forEach((locate) => {
      const { threads, info } = getObjFromGmail({ lang: locate });
      if (threads.length > 0) {
        writeToSpreadsheet(info);
        toTrash(threads);
      } else {
        console.log(`[${locate}] 0 messages has been found!`);
      }
    });
  } catch (error) {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
}

/**
 * Wrapper function to expose fixSubscriberLinks to Google Apps Script.
 * @see {@link https://developers.google.com/apps-script/guides/html/reference/run}
 */
// eslint-disable-next-line no-unused-vars
function fixLinksInSheet() {
  fixSubscriberLinks();
}
