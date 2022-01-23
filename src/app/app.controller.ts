import {
  Controller,
  Get,
  Inject,
} from '@nestjs/common';

import { Home } from './dto';
import { SuccessResponseData } from '@shared/dto';
import { IAppService } from './service';
import { TYPES } from '@config/dependency-injection';

@Controller()
export class AppController {
  constructor(
    @Inject(TYPES.AppService)
    private readonly appService: IAppService,
  ) { }

  @Get()
  getHello(): SuccessResponseData<Home> {
    return new SuccessResponseData(this.appService.getHello());
  }
}
