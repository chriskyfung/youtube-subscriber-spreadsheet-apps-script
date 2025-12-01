import { writeToSpreadsheet, fixSubscriberLinks } from './spreadsheetService';

describe('writeToSpreadsheet', () => {
  let mockRange;
  let mockSheet;

  beforeEach(() => {
    mockRange = {
      setValues: jest.fn(),
      getFormulas: jest.fn(),
      setFormulas: jest.fn(),
    };
    mockSheet = {
      insertRowsAfter: jest.fn(),
      getRange: jest.fn().mockReturnValue(mockRange),
    };
    global.SpreadsheetApp = {
      getActiveSheet: jest.fn().mockReturnValue(mockSheet),
    };
    jest.clearAllMocks();
  });

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
  let mockRange;
  let mockSheet;

  beforeEach(() => {
    mockRange = {
      setValues: jest.fn(),
      getFormulas: jest.fn(),
      setFormulas: jest.fn(),
    };
    mockSheet = {
      insertRowsAfter: jest.fn(),
      getRange: jest.fn().mockReturnValue(mockRange),
    };
    global.SpreadsheetApp = {
      getActiveSheet: jest.fn().mockReturnValue(mockSheet),
    };
    jest.clearAllMocks();
  });

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

    expect(mockSheet.getRange).toHaveBeenCalledWith('B:B');
    expect(mockRange.getFormulas).toHaveBeenCalledTimes(1);
    expect(mockRange.setFormulas).toHaveBeenCalledWith([
      ['=HYPERLINK("https://www.youtube.com/user/zzzz","User ZZZZ")'],
      ['=HYPERLINK("https://www.youtube.com/channel/yyyy","Channel YYYY")'],
      ['=HYPERLINK("https://www.youtube.com/user/direct","Direct User")'],
      ['Not a hyperlink'],
    ]);
  });
});
