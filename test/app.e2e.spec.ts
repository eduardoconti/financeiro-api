import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { appMock } from './nest-application.mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    app = await appMock()
    await app.init();

  });

  afterAll(async () => {
    await app.close();
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
