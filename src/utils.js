/**
 * Extracts the channel name from the 'To' header of an email.
 *
 * @param {GoogleAppsScript.Gmail.GmailMessage} email The Gmail message object.
 * @returns {string} The channel name.
 */
export function getChannelFromEmail(email) {
  return email.getTo().split('<')[0].trim();
}
