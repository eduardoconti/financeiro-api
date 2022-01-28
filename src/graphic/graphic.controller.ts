import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

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
export class GraphicController {
  constructor(
    @Inject(TYPES.GraphicService)
    private readonly graphicService: IGraphicService,
  ) {}
  @Get('general')
  async getGeneralGraphicData(@User() user: UserPayloadInterface) {
    return new SuccessResponseData<GeneralGraphicResponseDTO>(
      await this.graphicService.generalGraphic(user.userId),
    );
  }
}
