import { Controller, Get, HttpStatus, Inject, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { GeneralGraphicResponseDTO } from './dto/general-graphic';
import { IGraphicService } from './service';

@Controller('graphic')
@ApiTags('Graphic')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GraphicController {
  constructor(
    @Inject(TYPES.GraphicService)
    private readonly graphicService: IGraphicService,
  ) {}
  @Get('general')
  async getGeneralGraphicData(@User() user: UserPayloadInterface) {
    const data = await this.graphicService.generalGraphic(user.userId);
    return new SuccessResponseData<GeneralGraphicResponseDTO>(
      data,
      HttpStatus.OK,
    );
  }
}
