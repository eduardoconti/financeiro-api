import { GeneralGraphicResponseDTO } from './dto/general-graphic/general-graphic-response.dto';

import { Controller, Get, UseGuards } from '@nestjs/common';


import { GraphicService } from './service/graphic.service';

import { JwtAuthGuard } from '@auth/guard';
import { User } from '@shared/decorator';
import { SuccessResponseData } from '@shared/dto';
import { UserPayloadInterface } from '@auth/interfaces';

@Controller('graphic')
@UseGuards(JwtAuthGuard)
export class GraphicController {
    constructor(private readonly graphicService: GraphicService) { }
    @Get('general')

    async getGeneralGraphicData(
        @User() user: UserPayloadInterface,
    ) {
        return new SuccessResponseData<GeneralGraphicResponseDTO>(await this.graphicService.generalGraphic(user.userId))
    }
}
