import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  UseGuards,
} from '@nestjs/common';
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

import { FindExpenseByQueryParamsDTO } from '@expense/dto';

import { SwaggerApiSuccessResponse } from '@shared/decorators/swagger';
import { SuccessResponseData } from '@shared/dto';

import {
  GeneralGraphicResponseDTO,
  UnplannedExpensesResponseDTO,
} from './dto/general-graphic';
import { IGraphicService } from './service';

@Controller('graphic')
@ApiTags('Graphic')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(UnplannedExpensesResponseDTO, GeneralGraphicResponseDTO)
export class GraphicController {
  constructor(
    @Inject(TYPES.GraphicService)
    private readonly graphicService: IGraphicService,
  ) {}
  @Get('general')
  @ApiOperation({
    summary: 'Get unplanned data of general graphic.',
    description: 'Return relation of expenses, earnings and ballance',
  })
  @SwaggerApiSuccessResponse('Success', GeneralGraphicResponseDTO)
  async getGeneralGraphicData(@User() user: UserPayloadInterface) {
    const data = await this.graphicService.generalGraphic(user.userId);
    return new SuccessResponseData<GeneralGraphicResponseDTO>(
      data,
      HttpStatus.OK,
    );
  }

  @Get('expenses/unplanned')
  @ApiOperation({
    summary: 'Get unplanned expenses values grouped by month.',
    description:
      'Return total amount of all unplanned expenses grouped by month.',
  })
  @SwaggerApiSuccessResponse('Success', UnplannedExpensesResponseDTO)
  async getUnplannedExpenses(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<UnplannedExpensesResponseDTO>> {
    const { start, end } = params;
    const data = await this.graphicService.unplannedExpenses(
      user.userId,
      start,
      end,
    );

    return new SuccessResponseData<UnplannedExpensesResponseDTO>(
      data,
      HttpStatus.OK,
    );
  }
}
