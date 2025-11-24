import { LANG, regex } from './constants';
import { GMAIL_CONFIG } from './config';
import { getChannelFromEmail } from './utils';

/**
 * @typedef {object} SubscriberInfo
 * @property {string} id The Gmail thread ID.
 * @property {Date} date The date of the email.
 * @property {string} channel The YouTube channel name this notification is for.
 * @property {{url: string, name: string}} subscriber The subscriber's information.
 */

/**
 * @typedef {object} GmailExtractionResult
 * @property {GoogleAppsScript.Gmail.GmailThread[]} threads The processed Gmail threads.
 * @property {SubscriberInfo[]} info The extracted subscriber information.
 */

/**
 * Retrieves YouTube subscriber notification emails from Gmail, extracts subscriber information, and returns the data along with the corresponding Gmail threads.
 *
 * @param {object} options The options object.
 * @param {'en'|'hk'|'tw'} options.lang The language of the email.
 * @returns {GmailExtractionResult} An object containing the Gmail threads and the extracted subscriber information.
 */
export function getObjFromGmail(options) {
  try {
    const gmailThreads = GmailApp.search(
      `from:(${GMAIL_CONFIG.SEARCH_QUERY_FROM}) ${
        GMAIL_CONFIG.SEARCH_QUERY_SUBJECT_PREFIX
      }(${LANG[options.lang]})`,
    );
    const re = regex(options);
    return gmailThreads.reduce(
      (acc, thread) => {
        try {
          const numOfMessages = thread.getMessageCount();
          if (numOfMessages === 1) {
            const message = thread.getMessages()[0];
            const match = message.getBody().match(re);
            if (match) {
              acc.threads.push(thread);
              acc.info.push({
                id: thread.getId(),
                date: message.getDate(),
                channel: getChannelFromEmail(message),
                subscriber: match.groups,
              });
            } else {
              console.error(
                `Cannot extract info from Thread "${thread.getFirstMessageSubject()}"(${thread.getId()})`,
              );
            }
          } else {
            console.error(
              `Thread "${thread.getFirstMessageSubject()}"(${thread.getId()}) contains ${numOfMessages} messages!`,
            );
          }
        } catch (error) {
          console.error(
            `Error processing thread "${thread.getFirstMessageSubject()}"(${thread.getId()}): ${
              error.message
            }`,
          );
        }
        return acc;
      },
      { threads: [], info: [] },
    );
  } catch (error) {
    console.error(`Error searching Gmail: ${error.message}`);
    throw error;
  }
}

/**
 * Moves an array of Gmail threads to the trash.
 *
 * @param {GoogleAppsScript.Gmail.GmailThread[]} [threads=[]] An array of Gmail threads to be moved to the trash.
 */
export function toTrash(threads = []) {
  try {
    if (threads.length <= 100) {
      GmailApp.moveThreadsToTrash(threads);
    } else {
      for (let i = 0; i < threads.length; i += 100) {
        GmailApp.moveThreadsToTrash(threads.slice(i, i + 100));
      }
    }
    console.log(`Moved ${threads.length} to Trash!`);
  } catch (error) {
    console.error(`Error moving threads to trash: ${error.message}`);
    throw error;
  }
}
