export const LOCATES = ['en', 'hk', 'tw'];

export const LANG = {
  en: 'has subscribed to you on YouTube',
  hk: '訂閱了你的 YouTube 頻道',
  tw: '訂閱了您的 YouTube 頻道',
};

/**
 * Creates a regular expression to extract subscriber information from the HTML body of a YouTube notification email.
 *
 * @param {object} options The options object.
 * @param {'en'|'hk'|'tw'} options.lang The language of the email.
 * @returns {RegExp} The regular expression.
 */
export const regex = (options) =>
  new RegExp(
    `<a.*?href=\"\\S*?https:\\/\\/(?<url>\\S+)\".*?>(?<name>[\\s\\S]+?)<\\/a>\\s*.*?${LANG[options.lang]}`,
    's',
  );
