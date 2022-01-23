import { Controller, Get, UseGuards } from '@nestjs/common';
import { User } from '@shared/decorator';
import { SuccessResponseData } from '@shared/dto';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { GeneralGraphicResponseDTO } from './dto/general-graphic/general-graphic-response.dto';
import { GraphicService } from './service/graphic.service';

@Controller('graphic')
@UseGuards(JwtAuthGuard)
export class GraphicController {
  constructor(private readonly graphicService: GraphicService) {}
  @Get('general')
  async getGeneralGraphicData(@User() user: UserPayloadInterface) {
    return new SuccessResponseData<GeneralGraphicResponseDTO>(
      await this.graphicService.generalGraphic(user.userId),
    );
  }
}
