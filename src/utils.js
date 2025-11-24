export function getChannelFromEmail(email) {
  return email.getTo().split('<')[0].trim();
}
