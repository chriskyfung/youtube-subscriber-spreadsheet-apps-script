import { writeToSpreadsheet } from './spreadsheetService';

// Mock SpreadsheetApp
const mockRange = {
  setValues: jest.fn(),
};
const mockSheet = {
  insertRowsAfter: jest.fn(),
  getRange: jest.fn().mockReturnValue(mockRange),
};
global.SpreadsheetApp = {
  getActiveSheet: jest.fn().mockReturnValue(mockSheet),
};

describe('writeToSpreadsheet', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    jest.clearAllMocks();
  });

  it('should write data to the spreadsheet correctly', () => {
    const objArray = [
      {
        date: new Date('2023-01-01'),
        subscriber: {
          url: 'youtube.com/channel/UC123',
          name: 'Test Subscriber',
        },
        channel: 'Test Channel',
      },
    ];

    writeToSpreadsheet(objArray);

    expect(SpreadsheetApp.getActiveSheet).toHaveBeenCalledTimes(1);
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

  it('should handle an empty array without errors', () => {
    writeToSpreadsheet([]);

    expect(SpreadsheetApp.getActiveSheet).toHaveBeenCalledTimes(1);
    expect(mockSheet.insertRowsAfter).toHaveBeenCalledWith(1, 0);
    expect(mockSheet.getRange).toHaveBeenCalledWith(2, 1, 0, 3);
    expect(mockRange.setValues).toHaveBeenCalledWith([]);
  });

  it('should throw an error if SpreadsheetApp fails', () => {
    const error = new Error('Spreadsheet service failed');
    SpreadsheetApp.getActiveSheet.mockImplementation(() => {
      throw error;
    });

    expect(() => writeToSpreadsheet([{}])).toThrow(error);
  });
});
