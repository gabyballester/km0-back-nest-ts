import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async (): Promise<void> => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    module = moduleRef;
  });

  afterEach((): void => {
    jest.clearAllMocks();
  });

  it('should be defined', (): void => {
    expect(module).toBeDefined();
  });

  it('should provide AppController', (): void => {
    const controller = module.get<AppController>(AppController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(AppController);
  });

  it('should provide AppService', (): void => {
    const service = module.get<AppService>(AppService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(AppService);
  });

  it('should have AppController with getHello method', (): void => {
    const controller = module.get<AppController>(AppController);
    expect(typeof controller.getHello).toBe('function');
  });

  it('should have AppService with getHello method', (): void => {
    const service = module.get<AppService>(AppService);
    expect(typeof service.getHello).toBe('function');
  });

  it('should return same result from controller and service', (): void => {
    const controller = module.get<AppController>(AppController);
    const service = module.get<AppService>(AppService);

    const controllerResult = controller.getHello();
    const serviceResult = service.getHello();

    expect(controllerResult).toBe(serviceResult);
  });

  it('should have controller that calls service method', (): void => {
    const controller = module.get<AppController>(AppController);
    const service = module.get<AppService>(AppService);

    const serviceSpy = jest.spyOn(service, 'getHello');
    controller.getHello();

    expect(serviceSpy).toHaveBeenCalled();
  });

  it('should compile without errors', async (): Promise<void> => {
    await expect(
      Test.createTestingModule({
        imports: [AppModule],
      }).compile(),
    ).resolves.toBeDefined();
  });
});
