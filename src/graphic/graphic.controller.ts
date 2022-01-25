import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { User } from '@users/decorator';
import { SuccessResponseData } from '@shared/dto';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { TYPES } from '@config/dependency-injection';

import { GeneralGraphicResponseDTO } from './dto/general-graphic';
import { IGraphicService } from './service';

@Controller('graphic')
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
