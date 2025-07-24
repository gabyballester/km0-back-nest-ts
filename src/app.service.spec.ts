import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async (): Promise<void> => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should be defined', (): void => {
    expect(service).toBeDefined();
  });

  it('should be an instance of AppService', (): void => {
    expect(service).toBeInstanceOf(AppService);
  });

  describe('getHello', () => {
    it('should return "Hello World!"', (): void => {
      const result = service.getHello();
      expect(result).toBe('Hello World!');
    });

    it('should return a string', (): void => {
      const result = service.getHello();
      expect(typeof result).toBe('string');
    });

    it('should not be empty', (): void => {
      const result = service.getHello();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should contain "Hello"', (): void => {
      const result = service.getHello();
      expect(result).toContain('Hello');
    });

    it('should contain "World"', (): void => {
      const result = service.getHello();
      expect(result).toContain('World');
    });

    it('should have exact length', (): void => {
      const result = service.getHello();
      expect(result.length).toBe(12); // "Hello World!" tiene 12 caracteres
    });

    it('should be immutable (same result on multiple calls)', (): void => {
      const result1 = service.getHello();
      const result2 = service.getHello();
      expect(result1).toBe(result2);
    });

    it('should start with "Hello"', (): void => {
      const result = service.getHello();
      expect(result.startsWith('Hello')).toBe(true);
    });

    it('should end with "!"', (): void => {
      const result = service.getHello();
      expect(result.endsWith('!')).toBe(true);
    });

    it('should have space between Hello and World', (): void => {
      const result = service.getHello();
      expect(result).toMatch(/Hello\s+World/);
    });

    it('should not contain numbers', (): void => {
      const result = service.getHello();
      expect(result).not.toMatch(/\d/);
    });

    it('should be case sensitive', (): void => {
      const result = service.getHello();
      expect(result).not.toBe('hello world!');
      expect(result).not.toBe('HELLO WORLD!');
    });
  });
});
