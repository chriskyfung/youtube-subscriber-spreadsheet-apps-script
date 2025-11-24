import { getObjFromGmail, toTrash } from './gmailService';
import * as Utils from './utils'; // To mock getChannelFromEmail

// Mock GmailApp
const mockMessage = {
  getBody: () =>
    '<a href="https://youtube.com/channel/UC123">Test Subscriber</a> has subscribed to you on YouTube',
  getDate: () => new Date('2023-01-01'),
};

const mockThread = {
  getId: () => 'thread123',
  getMessageCount: () => 1,
  getMessages: () => [mockMessage],
  getFirstMessageSubject: () => 'New subscriber',
};

global.GmailApp = {
  search: jest.fn().mockReturnValue([mockThread]),
  moveThreadsToTrash: jest.fn(),
};

jest.mock('./utils', () => ({
  getChannelFromEmail: jest.fn().mockReturnValue('Test Channel'),
}));

describe('gmailService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getObjFromGmail', () => {
    const options = { lang: 'en' };

    it('should retrieve and process Gmail threads', () => {
      const { threads, info } = getObjFromGmail(options);

      expect(GmailApp.search).toHaveBeenCalledTimes(1);
      expect(threads).toHaveLength(1);
      expect(info).toHaveLength(1);
      expect(info[0].subscriber.name).toBe('Test Subscriber');
      expect(Utils.getChannelFromEmail).toHaveBeenCalledWith(mockMessage);
    });

    it('should handle threads with no matching content', () => {
      const nonMatchingThread = {
        ...mockThread,
        getMessages: () => [{ ...mockMessage, getBody: () => 'No match here' }],
      };
      GmailApp.search.mockReturnValue([nonMatchingThread]);

      const { threads, info } = getObjFromGmail(options);

      expect(threads).toHaveLength(0);
      expect(info).toHaveLength(0);
    });

    it('should handle threads with multiple messages', () => {
      const multiMessageThread = { ...mockThread, getMessageCount: () => 2 };
      GmailApp.search.mockReturnValue([multiMessageThread]);

      const { threads, info } = getObjFromGmail(options);

      expect(threads).toHaveLength(0);
      expect(info).toHaveLength(0);
    });

    it('should throw an error if GmailApp.search fails', () => {
      const error = new Error('Gmail search failed');
      GmailApp.search.mockImplementation(() => {
        throw error;
      });

      expect(() => getObjFromGmail(options)).toThrow(error);
    });

    it('should log an error and skip threads that cause processing errors', () => {
      const consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      const erroringThread = {
        ...mockThread,
        getId: () => 'error-thread',
        getMessages: () => {
          throw new Error('Test processing error');
        },
      };
      // Return one erroring thread and one valid thread
      GmailApp.search.mockReturnValue([erroringThread, mockThread]);

      const { threads, info } = getObjFromGmail(options);

      // Check that the valid thread was processed
      expect(threads).toHaveLength(1);
      expect(info).toHaveLength(1);

      // Check that the error was logged
      expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('Error processing thread'),
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('toTrash', () => {
    it('should move a single batch of threads to trash', () => {
      const threads = [mockThread, mockThread];
      toTrash(threads);

      expect(GmailApp.moveThreadsToTrash).toHaveBeenCalledWith(threads);
      expect(GmailApp.moveThreadsToTrash).toHaveBeenCalledTimes(1);
    });

    it('should move multiple batches of threads to trash', () => {
      const threads = Array(150).fill(mockThread);
      toTrash(threads);

      expect(GmailApp.moveThreadsToTrash).toHaveBeenCalledTimes(2);
      expect(GmailApp.moveThreadsToTrash).toHaveBeenNthCalledWith(
        1,
        threads.slice(0, 100),
      );
      expect(GmailApp.moveThreadsToTrash).toHaveBeenNthCalledWith(
        2,
        threads.slice(100, 200),
      );
    });

    it('should throw an error if moveThreadsToTrash fails', () => {
      const error = new Error('Failed to move threads');
      GmailApp.moveThreadsToTrash.mockImplementation(() => {
        throw error;
      });

      expect(() => toTrash([mockThread])).toThrow(error);
    });
  });
});
