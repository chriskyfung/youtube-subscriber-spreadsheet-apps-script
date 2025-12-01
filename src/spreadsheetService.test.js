import { writeToSpreadsheet, fixSubscriberLinks } from './spreadsheetService';

describe('spreadsheetService', () => {
  let mockRange;
  let mockSheet;
  let consoleLogSpy;

  beforeEach(() => {
    mockRange = {
      setValues: jest.fn(),
      getFormulas: jest.fn(),
      setFormulas: jest.fn(),
    };
    mockSheet = {
      insertRowsAfter: jest.fn(),
      getRange: jest.fn().mockReturnValue(mockRange),
      getLastRow: jest.fn().mockReturnValue(4), // Add mock for getLastRow
    };
    global.SpreadsheetApp = {
      getActiveSheet: jest.fn().mockReturnValue(mockSheet),
    };
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {}); // Spy on console.log
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore(); // Restore console.log after each test
  });

  describe('writeToSpreadsheet', () => {
    it('should write data to the spreadsheet correctly', () => {
      const objArray = [
        {
          date: new Date('2023-01-01'),
          subscriber: {
            url: 'https://youtube.com/channel/UC123',
            name: 'Test Subscriber',
          },
          channel: 'Test Channel',
        },
      ];

      writeToSpreadsheet(objArray);

      expect(global.SpreadsheetApp.getActiveSheet).toHaveBeenCalledTimes(1);
      expect(mockSheet.insertRowsAfter).toHaveBeenCalledWith(1, 1);
      expect(mockSheet.getRange).toHaveBeenCalledWith(2, 1, 1, 3);
      expect(mockRange.setValues).toHaveBeenCalledWith([
        [
          new Date('2023-01-01'),
          '=HYPERLINK("https://youtube.com/channel/UC123","Test Subscriber")',
          'Test Channel',
        ],
      ]);
    });

    it('should not call sheet methods for an empty array', () => {
      writeToSpreadsheet([]);

      expect(consoleLogSpy).toHaveBeenCalledWith('No new rows to add.');
      expect(global.SpreadsheetApp.getActiveSheet).not.toHaveBeenCalled();
      expect(mockSheet.insertRowsAfter).not.toHaveBeenCalled();
      expect(mockSheet.getRange).not.toHaveBeenCalled();
      expect(mockRange.setValues).not.toHaveBeenCalled();
    });

    it('should throw an error if SpreadsheetApp fails', () => {
      const error = new Error('Spreadsheet service failed');
      global.SpreadsheetApp.getActiveSheet.mockImplementation(() => {
        throw error;
      });

      expect(() => writeToSpreadsheet([{}])).toThrow(error);
    });
  });

  describe('fixSubscriberLinks', () => {
    it('should fix hyperlink formulas in the specified range', () => {
      const formulas = [
        [
          '=HYPERLINK("https://www.youtube.com/attribution_link?a=xxxx&u=/user/zzzz%3Ffeature%3Dem-subscription_create","User ZZZZ")',
        ],
        [
          '=HYPERLINK("https://www.youtube.com/attribution_link?a=xxxx&u=/channel/yyyy%3Ffeature%3Dhttp://www.youtube.com/channel/yyyy%253Ffeature%253Dem-subscription_create","Channel YYYY")',
        ],
        ['=HYPERLINK("https://www.youtube.com/user/direct","Direct User")'],
        ['Not a hyperlink'],
      ];
      mockRange.getFormulas.mockReturnValue(formulas);

      fixSubscriberLinks();

      expect(mockSheet.getRange).toHaveBeenCalledWith('B1:B4');
      expect(mockRange.getFormulas).toHaveBeenCalledTimes(1);
      expect(mockRange.setFormulas).toHaveBeenCalledWith([
        ['=HYPERLINK("https://www.youtube.com/user/zzzz","User ZZZZ")'],
        ['=HYPERLINK("https://www.youtube.com/channel/yyyy","Channel YYYY")'],
        ['=HYPERLINK("https://www.youtube.com/user/direct","Direct User")'],
        ['Not a hyperlink'],
      ]);
      expect(consoleLogSpy).toHaveBeenCalledWith(
        'Subscriber links in Column B have been fixed.',
      );
    });

    it('should fix hyperlink formulas without explicit display text', () => {
      const formulas = [
        ['=HYPERLINK("https://www.youtube.com/channel/UC-no-display-text")'],
      ];
      mockRange.getFormulas.mockReturnValue(formulas);

      fixSubscriberLinks();

      expect(mockRange.setFormulas).toHaveBeenCalledWith([
        [
          '=HYPERLINK("https://www.youtube.com/channel/UC-no-display-text","https://www.youtube.com/channel/UC-no-display-text")',
        ],
      ]);
    });

    it('should fix hyperlink formulas with display text containing </b>', () => {
      const formulas = [
        [
          '=HYPERLINK("https://www.youtube.com/channel/UC-bold-text","Channel Name</b>")',
        ],
      ];
      mockRange.getFormulas.mockReturnValue(formulas);

      fixSubscriberLinks();

      expect(mockRange.setFormulas).toHaveBeenCalledWith([
        [
          '=HYPERLINK("https://www.youtube.com/channel/UC-bold-text","Channel Name")',
        ],
      ]);
    });

    it('should throw an error if SpreadsheetApp fails during link fixing', () => {
      const error = new Error('Spreadsheet service failed during link fixing');
      mockSheet.getRange.mockImplementation(() => {
        throw error;
      });

      expect(() => fixSubscriberLinks()).toThrow(error);
      expect(global.SpreadsheetApp.getActiveSheet).toHaveBeenCalledTimes(1);
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        'Subscriber links in Column B have been fixed.',
      );
    });
  });
});
