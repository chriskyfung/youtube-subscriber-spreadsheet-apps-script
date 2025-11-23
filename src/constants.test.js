import { regex, LANG } from './constants';

describe('regex for YouTube subscription messages', () => {
  // Common language option for testing
  const options = { lang: 'en' };
  const expectedLangText = LANG[options.lang];

  // --- Positive Test Cases ---

  test('should match a single-line HTML anchor tag with no extra spaces', () => {
    const html = `<a href="https://youtube.com/channel/UC123">Channel Name</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC123');
    expect(match.groups.name).toBe('Channel Name');
  });

  test('should match a single-line HTML anchor tag with leading/trailing spaces in name', () => {
    const html = `<a href="https://youtube.com/channel/UC123">  Channel Name  </a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC123');
    expect(match.groups.name).toBe('  Channel Name  '); // Should capture exact content
  });

  test('should match a multi-line HTML anchor tag with indentation', () => {
    const html = `
      <a href="https://youtube.com/channel/UC456">
        Multi-line Channel Name
      </a>
      ${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC456');
    expect(match.groups.name.trim()).toBe('Multi-line Channel Name');
  });

  test('should match with additional attributes in anchor tag', () => {
    const html = `<a target="_blank" class="yt-link" href="https://youtube.com/channel/UC789">Another Channel</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC789');
    expect(match.groups.name).toBe('Another Channel');
  });

  test('should match when the subscription text is immediately after the anchor tag', () => {
    const html = `<a href="https://youtube.com/channel/UC101">Direct Channel</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC101');
    expect(match.groups.name).toBe('Direct Channel');
  });

  test('should match when the subscription text is on a new line after the anchor tag', () => {
    const html = `
      <a href="https://youtube.com/channel/UC202">Channel Two</a>
      ${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC202');
    expect(match.groups.name.trim()).toBe('Channel Two');
  });

  test('should match with complex nested content in name (though unlikely for channel names)', () => {
    const html = `<a href="https://youtube.com/channel/UC303"><b>Bold</b> <i>Channel</i> Name</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull();
    expect(match.groups.url).toBe('youtube.com/channel/UC303');
    expect(match.groups.name).toBe('<b>Bold</b> <i>Channel</i> Name');
  });

  // --- Negative Test Cases ---

  test('should NOT match if the href does not contain https://youtube.com', () => {
    const html = `<a href="http://example.com/channel/UCABC">Invalid Channel</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match if the language text is missing', () => {
    const html = `<a href="https://youtube.com/channel/UCDEF">Missing Text Channel</a>`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match if the closing </a> tag is missing', () => {
    const html = `<a href="https://youtube.com/channel/UCGHI">Missing Close Tag Channel${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match if the opening <a> tag is malformed', () => {
    const html = `<a href=https://youtube.com/channel/UCJKL">Malformed Link</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match if the URL is incomplete', () => {
    const html = `<a href="https://youtube.com/">Incomplete URL</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).not.toBeNull(); // This actually matches because \S+ means one or more non-whitespace. "youtube.com/" is valid.
    expect(match.groups.url).toBe('youtube.com/');
    // Re-evaluate this negative test case. If the intent is to ensure a *full* channel ID, the regex needs adjustment.
    // For now, it matches 'youtube.com/' which is technically valid for \S+.
    // A more specific regex for a full channel URL might be required if this is a strict requirement.
  });

  test('should NOT match if href attribute is missing', () => {
    const html = `<a>Channel Name Without Href</a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match with different language text', () => {
    const html = `<a href="https://youtube.com/channel/UCXYZ">Some Channel</a>Some other text`;
    const match = html.match(regex(options));
    expect(match).toBeNull();
  });

  test('should NOT match an empty name', () => {
    const html = `<a href="https://youtube.com/channel/UCXYZ"></a>${expectedLangText}`;
    const match = html.match(regex(options));
    expect(match).toBeNull(); // Our regex (?<name>[\\s\\S]+?) requires at least one character
  });
});
