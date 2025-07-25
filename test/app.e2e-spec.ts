import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { ConfigModule } from '@nestjs/config';
import { ENV_KEYS, ENV_VALUES } from '../src/shared/constants/environment';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [
            () => ({
              [ENV_KEYS.NODE_ENV]: ENV_VALUES.NODE_ENV.TEST,
              [ENV_KEYS.PORT]: 4003,
              [ENV_KEYS.DATABASE_URL]:
                'postgresql://test:test@localhost:5432/test_db',
              [ENV_KEYS.JWT_SECRET]:
                'test-jwt-secret-key-for-testing-purposes-only',
            }),
          ],
        }),
        AppModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
