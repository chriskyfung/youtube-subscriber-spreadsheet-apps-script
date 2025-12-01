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
  // First, check if it's an attribution link
  if (url.includes('attribution_link')) {
    const cleanedAttributionLink = extractAndCleanAttributionLink(url);
    // If the attribution link was successfully cleaned, return it.
    // Otherwise, fall through to the direct link matching.
    if (cleanedAttributionLink !== url) {
      return cleanedAttributionLink;
    }
  }

  // Then, apply the regex for direct YouTube channel/user URLs
  let match = url.match(
    /https?:\/\/www\.youtube\.com\/(channel|user)\/([a-zA-Z0-9_-]+)/,
  );
  if (match) {
    // Ensure the returned URL uses https and reconstruct the clean URL
    return `https://www.youtube.com/${match[1]}/${match[2]}`;
  }
  return url; // Return original URL if no match found
}

/**
 * Extracts and cleans a YouTube channel/user URL from an attribution link.
 *
 * @param {string} url The problematic attribution link URL.
 * @returns {string} The cleaned YouTube channel/user URL, or the original URL if no match.
 */
function extractAndCleanAttributionLink(url) {
  const queryStartIndex = url.indexOf('?');
  if (queryStartIndex === -1) {
    return url; // Not a URL with query parameters
  }

  const queryString = url.substring(queryStartIndex + 1);
  // First, replace HTML-encoded ampersands, then split into parameters
  const params = queryString.replace(/&amp;/g, '&').split('&');

  const uParam = params.find((p) => p.startsWith('u='));

  if (uParam) {
    const uParamValue = uParam.substring(2);
    // Recursively call fixHyperlinkUrl on the uParamValue to handle nested problematic formats
    return fixHyperlinkUrl('https://www.youtube.com' + uParamValue);
  }
  return url; // Return original URL if no 'u' parameter found or other issues
}

/**
 * Trims a trailing </b> tag from a string.
 *
 * @param {string} text The text to clean.
 * @returns {string} The cleaned text.
 */
export function cleanDisplayText(text) {
  if (text.endsWith('</b>')) {
    return text.slice(0, -4);
  }
  return text;
}
