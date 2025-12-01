/**
 * Extracts the channel name from the 'To' header of an email.
 *
 * @param {GoogleAppsScript.Gmail.GmailMessage} email The Gmail message object.
 * @returns {string} The channel name.
 */
export function getChannelFromEmail(email) {
  return email.getTo().split('<')[0].trim();
}

/**
 * Extracts and fixes the YouTube channel URL from a problematic hyperlink URL.
 *
 * @param {string} url The problematic URL from the HYPERLINK function.
 * @returns {string} The cleaned YouTube channel URL.
 */
export function fixHyperlinkUrl(url) {
  const match = url.match(
    /https:\/\/www\.youtube\.com\/channel\/[a-zA-Z0-9_-]+/,
  );
  if (match) {
    return match[0];
  }
  return url; // Return original URL if no match found
}
