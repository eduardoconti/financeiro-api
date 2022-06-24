import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { AppController } from './app.controller';
import { HomeDTO } from './dto';
import { IAppService } from './service';

const homeDto = new HomeDTO('financeiro', 200, '1.0');
describe('AppController', () => {
  let appController: AppController;
  let appService: IAppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      imports: [ConfigModule],
      providers: [
        {
          provide: TYPES.AppService,
          useValue: {
            healthCheck: jest.fn(),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<IAppService>(TYPES.AppService);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(appController).toBeDefined();
      expect(appService).toBeDefined();
    });
    it('should be able to getHello', () => {
      jest.spyOn(appService, 'healthCheck').mockImplementation(() => homeDto);
      const data = appController.getHello();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(SuccessResponseData);
    });
  });
});
