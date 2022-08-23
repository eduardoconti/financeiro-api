import { Controller, Get, Query, UseGuards, Inject } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SUCCESS_MESSAGES } from '@shared/constants';
import { SwaggerApiSuccessResponse } from '@shared/decorators/swagger';
import { SuccessResponseData } from '@shared/dto';
import { HttpInternalMessages } from '@shared/enums';

import { DashBoardValues, GetDashBoardValuesParams } from './dto';
import { IDashBoardService } from './service';

@Controller('dashboard')
@ApiTags('DashBoard')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(DashBoardValues)
export class DashBoardController {
  constructor(
    @Inject(TYPES.DashBoardService)
    private readonly dashBoardService: IDashBoardService,
  ) {}

  @Get('values')
  @ApiOperation({
    summary: 'Get values for dashboard',
    description: 'Return values for dashboard',
  })
  @SwaggerApiSuccessResponse(HttpInternalMessages.OK, DashBoardValues)
  async getAllExpenses(
    @User() user: UserPayloadInterface,
    @Query() param: GetDashBoardValuesParams,
  ): Promise<SuccessResponseData<DashBoardValues>> {
    const data = await this.dashBoardService.getValues(user.userId, param);
    return new SuccessResponseData<DashBoardValues>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }
}
