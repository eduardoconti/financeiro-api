import { Controller, Get, Inject } from '@nestjs/common';
import { SuccessResponseData } from '@shared/dto';

import { TYPES } from '@config/dependency-injection';

import { Home } from './dto';
import { IAppService } from './service';

@Controller()
export class AppController {
  constructor(
    @Inject(TYPES.AppService)
    private readonly appService: IAppService,
  ) {}

  @Get()
  getHello(): SuccessResponseData<Home> {
    return new SuccessResponseData(this.appService.getHello());
  }
}
