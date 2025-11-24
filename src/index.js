// @ts-ignore

import { LOCATES } from './constants';
import { getObjFromGmail, toTrash } from './gmailService';
import { writeToSpreadsheet } from './spreadsheetService';

// eslint-disable-next-line no-unused-vars
function main() {
  LOCATES.forEach((locate) => {
    const { threads, info } = getObjFromGmail({ lang: locate });
    if (threads.length > 0) {
      writeToSpreadsheet(info);
      toTrash(threads);
    } else {
      console.log(`[${locate}] 0 messages has been found!`);
    }
  });
}
