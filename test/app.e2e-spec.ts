import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

// Configurar variables de entorno para tests E2E
beforeAll(() => {
  process.env.NODE_ENV = 'test';
  process.env.PORT = '4003';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test_db';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-purposes-only';
});

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async (): Promise<void> => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async (): Promise<void> => {
    await app.close();
  });

  it('/ (GET)', async (): Promise<void> => {
    const response = await request(app.getHttpServer()).get('/').expect(200);

    expect(response.text).toBe('Hello World!');
  });
});
