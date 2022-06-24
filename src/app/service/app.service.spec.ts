import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';

import { HomeDTO } from '@app/dto';

import { TYPES } from '@config/dependency-injection';

import { AppService } from './app.service';
import { IAppService } from './app.service.interface';

const configServiceMocked = {
  get: jest.fn(),
};
describe('AppService', () => {
  let appService: IAppService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: TYPES.AppService,
          useClass: AppService,
        },
        {
          provide: ConfigService,
          useValue: configServiceMocked,
        },
      ],
    }).compile();

    appService = module.get<IAppService>(TYPES.AppService);
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });

  it('should return health check', () => {
    jest
      .spyOn(configServiceMocked, 'get')
      .mockImplementationOnce(() => 'financeiro')
      .mockImplementationOnce(() => '1.0.0');

    expect(appService.healthCheck()).toStrictEqual(
      new HomeDTO('financeiro', HttpStatus.OK, '1.0.0'),
    );
  });
});
