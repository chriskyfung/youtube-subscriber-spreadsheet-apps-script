import { getChannelFromEmail } from './utils';

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
