export const locates = ['en', 'hk', 'tw'];

export const lang = {
  en: 'has subscribed to you on YouTube',
  hk: '訂閱了你的 YouTube 頻道',
  tw: '訂閱了您的 YouTube 頻道',
};

export const regex = (options) =>
  new RegExp(
    '<a href=\\S*?"https:\\/\\/(?<url>[\\S]+)".+>(?<name>.+)<\\/a>.*?' +
      lang[options.lang],
  );
