import { regex } from './constants';

describe('regex for YouTube subscription messages', () => {
  // Test case for English language
  test('should correctly extract URL and name from English subscription message', () => {
    const options = { lang: 'en' };
    const html = `<a href="https://www.youtube.com/attribution_link?a=xxxxxxxxxxxxxxxx&amp;u=/channel/yyyyyyyyyyyyy-yyyyyyyyyy%3Ffeature%3Dhttps://www.youtube.com/channel/yyyyyyyyyyyyy-yyyyyyyyyy%253Ffeature%253Dem-subscription_create" style="text-decoration:none; color:#1C62B9;">New Subscriber Name</a> has subscribed to you on YouTube`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe(
      'https://www.youtube.com/channel/yyyyyyyyyyyyy-yyyyyyyyyy',
    );
    expect(match.groups.name).toBe('New Subscriber Name');
  });

  // Test case for Traditional Chinese (Hong Kong) language
  test('should correctly extract URL and name from Traditional Chinese (Hong Kong) subscription message', () => {
    const options = { lang: 'hk' };
    const html = `「<a href="https://www.youtube.com/attribution_link?a=xxxxxxxxxxxxxxxx&amp;u=/channel/yyyyyyyyyyyyyyyyyyyyyyyy%3Ffeature%3Dhttps://www.youtube.com/channel/yyyyyyyyyyyyyyyyyyyyyyyy%253Ffeature%253Dem-subscription_create" style="text-decoration:none; color:#1C62B9;">新訂閱者名稱_HK</a>」訂閱了你的 YouTube 頻道`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe(
      'https://www.youtube.com/channel/yyyyyyyyyyyyyyyyyyyyyyyy',
    );
    expect(match.groups.name).toBe('新訂閱者名稱_HK');
  });

  // Test case for Traditional Chinese (Taiwan) language - Assuming LANG.tw is '訂閱了您的 YouTube 頻道'
  test('should correctly extract URL and name from Traditional Chinese (Taiwan) subscription message', () => {
    const options = { lang: 'tw' };
    const html = `「<a href="https://www.youtube.com/attribution_link?a=xxxxxxxxxxxxxxxx&amp;u=/channel/zzzzzzzzzzzzzzzzzzzzzzzzzz%3Ffeature%3Dhttps://www.youtube.com/channel/zzzzzzzzzzzzzzzzzzzzzzzzzz%253Ffeature%253Dem-subscription_create" style="text-decoration:none; color:#1C62B9;">新訂閱者名稱_TW</a>」訂閱了您的 YouTube 頻道`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe(
      'https://www.youtube.com/channel/zzzzzzzzzzzzzzzzzzzzzzzzzz',
    );
    expect(match.groups.name).toBe('新訂閱者名稱_TW');
  });

  // Negative test case: should NOT match if the href does not contain the attribution_link structure
  test('should NOT match a plain YouTube channel URL without attribution_link', () => {
    const options = { lang: 'en' };
    const html = `<a href="https://www.youtube.com/channel/UC123">Channel Name</a> has subscribed to you on YouTube`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  // Negative test case: should NOT match if the language text is missing
  test('should NOT match if the language text is missing', () => {
    const options = { lang: 'en' };
    const html = `<a href="https://www.youtube.com/attribution_link?a=xxxxxxxxxxxxxxxx&u=/channel/yyyyyyyyyyyyy-yyyyyyyyyy%3Ffeature%3Dhttps://www.youtube.com/channel/yyyyyyyyyyyyy-yyyyyyyyyy%253Ffeature%253Dem-subscription_create" style="text-decoration:none; color:#1C62B9;">New Subscriber Name</a>`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });
});
