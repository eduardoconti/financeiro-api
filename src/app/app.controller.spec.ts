import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TYPES } from '@config/dependency-injection';

import { AppController } from './app.controller';
import { IAppService } from './service';
import { SuccessResponseData } from '@shared/dto';
import { HomeDTO } from './dto';

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
            getHello: jest.fn(),
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
      const data = appController.getHello();
      expect(data).toBeDefined();
      expect(data).toBeInstanceOf(SuccessResponseData);
    });
  });
});
