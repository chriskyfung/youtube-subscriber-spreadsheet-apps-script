'use strict';

const locates = ['en', 'zh'];
const lang = {
  en: 'has subscribed to you on YouTube',
  zh: '訂閱了你的 YouTube 頻道'
};

function getObjFromGmail(options) {
  const gmailThreads = GmailApp.search(`from:(noreply@youtube.com) subject:(${lang[options.lang]})`);
  const objArray = [];
  const validThreads = [];
  gmailThreads.forEach(thread => {
    const numOfMessages = thread.getMessageCount();

    if (numOfMessages === 1) {
      const message = thread.getMessages()[0];
      const re = new RegExp('<a href=\\S*?"https:\\/\\/(?<url>[\\S]+)".+>(?<name>.+)<\\/a>.*?' + lang[options.lang]);
      const match = message.getBody().match(re);

      if (match) {
        validThreads.push(thread);
        objArray.push({
          id: thread.getId(),
          date: message.getDate(),
          channel: message.getTo().split('<')[0],
          subsciber: match.groups
        });
      } else {
        console.error(`Cannot extract info from Thread "${thread.getFirstMessageSubject()}"(${thread.getId()})`);
      }
    } else {
      console.error(`Thread "${thread.getFirstMessageSubject()}"(${thread.getId()}) contains ${numOfMessages}!`);
    }
  });
  return {
    threads: validThreads,
    info: objArray
  };
}

function writeToSpreadsheet(objArray = []) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const table = objArray.map(x => [x.date, `=HYPERLINK("https://${x.subsciber.url}","${x.subsciber.name}")`, x.channel]);
  sheet.insertRowsAfter(1, objArray.length);
  const range = sheet.getRange(2, 1, objArray.length, 3);
  range.setValues(table);
  console.log(`Added ${objArray.length} new rows to spread sheet!`);
}

function toTrash(threads = []) {
  if (threads.length <= 100) {
    GmailApp.moveThreadsToTrash(threads);
  } else {
    for (let i = 0; i < threads.length; i + 100) {
      GmailApp.moveThreadsToTrash(threads.slice(i, i + 99));
    }
  }

  console.log(`Moved ${threads.length} to Trash!`);
}

function main() {
  locates.forEach(locate => {
    const {
      threads,
      info
    } = getObjFromGmail({
      lang: locate
    });

    if (threads.length > 0) {
      writeToSpreadsheet(info);
      toTrash(threads);
    } else {
      console.log(`[${locate}] 0 messages has been found!`);
    }
  });
}
