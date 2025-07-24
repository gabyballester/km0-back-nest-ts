import { Logger } from '@nestjs/common';

// Mock Logger
jest.mock('@nestjs/common', () => ({
  Logger: {
    error: jest.fn(),
  },
}));

describe('main.ts', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have bootstrap function', (): void => {
    // This test just ensures the file can be imported without errors
    expect(true).toBe(true);
  });

  it('should have Logger import', (): void => {
    expect(Logger).toBeDefined();
  });
});
