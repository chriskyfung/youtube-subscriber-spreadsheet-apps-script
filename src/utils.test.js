import {
  getChannelFromEmail,
  fixHyperlinkUrl,
  cleanDisplayText,
} from './utils';

describe('getChannelFromEmail', () => {
  it('should extract the channel name from the "To" header', () => {
    const mockEmail = {
      getTo: () => 'Test Channel <test@example.com>',
    };
    expect(getChannelFromEmail(mockEmail)).toBe('Test Channel');
  });

  it('should handle emails with no name part', () => {
    const mockEmail = {
      getTo: () => 'test@example.com',
    };
    expect(getChannelFromEmail(mockEmail)).toBe('test@example.com');
  });

  it('should handle extra spaces', () => {
    const mockEmail = {
      getTo: () => '  Another Channel  <another@example.com>  ',
    };
    expect(getChannelFromEmail(mockEmail)).toBe('Another Channel');
  });
});

describe('fixHyperlinkUrl', () => {
  it('should fix attribution links with encoded user URL', () => {
    const url =
      'https://www.youtube.com/attribution_link?a=xxxx&u=/user/zzzz%3Ffeature%3Dem-subscription_create';
    expect(fixHyperlinkUrl(url)).toBe('https://www.youtube.com/user/zzzz');
  });

  it('should fix attribution links with doubly encoded user URL', () => {
    const url =
      'https://www.youtube.com/attribution_link?a=xxxx&u=/user/zzzz%3Ffeature%3Dhttp://www.youtube.com/user/zzzz%253Ffeature%253Dem-subscription_create';
    expect(fixHyperlinkUrl(url)).toBe('https://www.youtube.com/user/zzzz');
  });

  it('should fix attribution links with doubly encoded channel URL', () => {
    const url =
      'https://www.youtube.com/attribution_link?a=xxxx&u=/channel/yyyy%3Ffeature%3Dhttp://www.youtube.com/channel/yyyy%253Ffeature%253Dem-subscription_create';
    expect(fixHyperlinkUrl(url)).toBe('https://www.youtube.com/channel/yyyy');
  });

  it('should fix attribution links with triply encoded channel URL', () => {
    const url =
      'https://www.youtube.com/attribution_link?a=xxxx&u=/channel/yyyy%3Ffeature%3Dhttps://www.youtube.com/channel/yyyy%253Ffeature%253Dem-subscription_create';
    expect(fixHyperlinkUrl(url)).toBe('https://www.youtube.com/channel/yyyy');
  });

  it('should return the original URL if no attribution link is found', () => {
    const url = 'https://www.youtube.com/watch?v=1234';
    expect(fixHyperlinkUrl(url)).toBe(url);
  });
});

describe('cleanDisplayText', () => {
  it('should remove trailing </b> tag', () => {
    const text = 'Some Channel Name</b>';
    expect(cleanDisplayText(text)).toBe('Some Channel Name');
  });

  it('should not change text without trailing </b> tag', () => {
    const text = 'Some Channel Name';
    expect(cleanDisplayText(text)).toBe(text);
  });
});
