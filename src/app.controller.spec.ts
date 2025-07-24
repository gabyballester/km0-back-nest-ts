import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async (): Promise<void> => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should be defined', (): void => {
    expect(appController).toBeDefined();
  });

  it('should be an instance of AppController', (): void => {
    expect(appController).toBeInstanceOf(AppController);
  });

  it('should have appService injected', (): void => {
    expect(appService).toBeDefined();
  });

  it('should have appService as an instance of AppService', (): void => {
    expect(appService).toBeInstanceOf(AppService);
  });

  describe('root', () => {
    it('should return "Hello World!"', (): void => {
      const result = appController.getHello();
      expect(result).toBe('Hello World!');
    });

    it('should call appService.getHello', (): void => {
      const getHelloSpy = jest.spyOn(appService, 'getHello');
      appController.getHello();
      expect(getHelloSpy).toHaveBeenCalled();
    });

    it('should return a string', (): void => {
      const result = appController.getHello();
      expect(typeof result).toBe('string');
    });

    it('should return same result as service', (): void => {
      const serviceResult = appService.getHello();
      const controllerResult = appController.getHello();
      expect(controllerResult).toBe(serviceResult);
    });

    it('should call service exactly once', (): void => {
      const getHelloSpy = jest.spyOn(appService, 'getHello');
      appController.getHello();
      expect(getHelloSpy).toHaveBeenCalledTimes(1);
    });

    it('should not call service before getHello is invoked', (): void => {
      const getHelloSpy = jest.spyOn(appService, 'getHello');
      expect(getHelloSpy).not.toHaveBeenCalled();
    });

    it('should return non-empty string', (): void => {
      const result = appController.getHello();
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return string with correct length', (): void => {
      const result = appController.getHello();
      expect(result.length).toBe(12); // "Hello World!" tiene 12 caracteres
    });

    it('should return string containing "Hello"', (): void => {
      const result = appController.getHello();
      expect(result).toContain('Hello');
    });

    it('should return string containing "World"', (): void => {
      const result = appController.getHello();
      expect(result).toContain('World');
    });

    it('should return string ending with "!"', (): void => {
      const result = appController.getHello();
      expect(result.endsWith('!')).toBe(true);
    });
  });
});
