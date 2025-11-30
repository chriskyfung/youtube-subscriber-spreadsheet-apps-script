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
    `<a\\s+href="https:\\/\\/www\\.youtube\\.com\\/attribution_link\\?a=[^&]+?(&|&amp;)u=.*?feature%3D(?<url>https?:\\/\\/www\\.youtube\\.com\\/channel\\/[^%]+).*?>(?<name>.+?)<\\/a>[\\s\\S]*?${LANG[options.lang]}`,
  );
