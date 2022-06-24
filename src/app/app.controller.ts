import { Controller, Get, HttpStatus, Inject } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { TYPES } from '@config/dependency-injection';

import { SUCCESS_MESSAGES } from '@shared/constants';
import {
  SwaggerApiInternalServerErrorResponse,
  SwaggerApiSuccessResponse,
} from '@shared/decorators/swagger';
import { ExtraModels } from '@shared/decorators/swagger/extra-model.decorator';
import { SuccessResponseData } from '@shared/dto';
import { HttpInternalMessages } from '@shared/enums';

import { HomeDTO } from './dto';
import { IAppService } from './service';

@Controller('app')
@ApiTags('App')
@ExtraModels()
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
  @SwaggerApiInternalServerErrorResponse(
    HttpInternalMessages.INTERNAL_SERVER_ERROR,
  )
  @SwaggerApiSuccessResponse(HttpInternalMessages.OK, HomeDTO)
  getHello(): SuccessResponseData<HomeDTO> {
    return new SuccessResponseData<HomeDTO>(
      this.appService.healthCheck(),
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }
}
