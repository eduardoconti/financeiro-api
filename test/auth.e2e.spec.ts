import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { appMock } from './nest-application.mock';
import { JwtService } from '@nestjs/jwt';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;

  beforeEach(async () => {
    app = await appMock();
    await app.init();

    jwtService = app.get(JwtService);
    jest.spyOn(jwtService, 'signAsync').mockResolvedValue('JWTTOKEN');
  });

  afterAll(async () => {
    await app.close();
  });

  const endpoint = '/auth';

  describe('/auth/login (POST)', () => {
    describe('CREATED (201)', () => {
      it('deve fazer login e retornar token', async () => {
        return await request(app.getHttpServer())
          .post(`${endpoint}/login`)
          .send({
            username: 'user',
            password: 'teste@123',
          })
          .expect(201)
          .expect(({ body }) => {
            expect(body).toStrictEqual({
              status: 201,
              internalMessage: 'Success',
              message: 'Usuário autenticado!',
              data: { accessToken: 'JWTTOKEN' },
            });
          });
      });
    });

    describe('UNAUTHORIZED (401)', () => {
      it('deve falhar ao passar senha invalida', async () => {
        return await request(app.getHttpServer())
          .post(`${endpoint}/login`)
          .send({
            username: 'user',
            password: 'teste@12',
          })
          .expect(401)
          .expect(({ body }) => {
            expect(body).toStrictEqual({
              detail: 'Erro ao comparar senha com hash.',
              status: 401,
              title: 'Unauthorized',
            });
          });
      });
    });

    describe('NOT FOUND (404)', () => {
      it('deve falhar ao passar usuario inexistente', async () => {
        return await request(app.getHttpServer())
          .post(`${endpoint}/login`)
          .send({
            username: 'use',
            password: 'teste@123',
          })
          .expect(404)
          .expect(({ body }) => {
            expect(body).toStrictEqual({
              detail: 'Usuário naõ encontrado!',
              status: 404,
              title: 'Not found',
            });
          });
      });
    });
  });
});
