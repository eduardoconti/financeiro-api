import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { HomeDTO } from './dto';
import { IAppService } from './service';

@Controller('app')
@ApiTags('App')
export class AppController {
  constructor(
    @Inject(TYPES.AppService)
    private readonly appService: IAppService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Check health API',
    description: 'Get Health API information',
  })
  getHello(): SuccessResponseData<HomeDTO> {
    return new SuccessResponseData(this.appService.getHello());
  }
}
