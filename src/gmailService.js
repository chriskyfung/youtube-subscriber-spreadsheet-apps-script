import { LANG, regex } from './constants';
import { GMAIL_CONFIG } from './config';
import { getChannelFromEmail } from './utils';

export function getObjFromGmail(options) {
  const gmailThreads = GmailApp.search(
    `from:(${GMAIL_CONFIG.SEARCH_QUERY_FROM}) ${GMAIL_CONFIG.SEARCH_QUERY_SUBJECT_PREFIX}(${LANG[options.lang]})`,
  );
  const objArray = [];
  const validThreads = [];
  const re = regex(options);
  gmailThreads.forEach((thread) => {
    const numOfMessages = thread.getMessageCount();
    if (numOfMessages === 1) {
      const message = thread.getMessages()[0];
      const match = message.getBody().match(re);
      if (match) {
        validThreads.push(thread);
        objArray.push({
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
        `Thread "${thread.getFirstMessageSubject()}"(${thread.getId()}) contains ${numOfMessages}!`,
      );
    }
  });
  return {
    threads: validThreads,
    info: objArray,
  };
}

export function toTrash(threads = []) {
  if (threads.length <= 100) {
    GmailApp.moveThreadsToTrash(threads);
  } else {
    for (let i = 0; i < threads.length; i += 100) {
      GmailApp.moveThreadsToTrash(threads.slice(i, i + 100));
    }
  }
  console.log(`Moved ${threads.length} to Trash!`);
}
