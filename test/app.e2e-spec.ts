import { AppModule } from '@app/app.module';
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/app')
      .expect(200)
      .expect(({ body }) => {
        expect(body).toStrictEqual({
          status: 200,
          internalMessage: 'Success',
          message: 'Resposta retornada com sucesso!',
          data: { api: 'financeiro', status: 200, version: '1.0.0' },
        });
      });
  });
});
