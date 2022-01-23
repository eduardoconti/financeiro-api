import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';
import { TYPES } from '@config/dependency-injection';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  Inject,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';
import { User } from '@shared/decorator';
import { UserLoggedGuard } from '@users/guard';
import { CarteirasDTO } from './dto';
import { Carteiras } from './entity';
import { ICarteirasService } from './service';

@Controller('carteiras')
@ApiTags('carteiras')
@UseGuards(JwtAuthGuard)
export class CarteirasController {
  constructor(
    @Inject(TYPES.CarteiraService)
    private readonly carteiraService: ICarteirasService) { }

  @Get()
  @UseGuards(UserLoggedGuard)
  async getAll(@User() user: UserPayloadInterface): Promise<Carteiras[]> {
    return await this.carteiraService.retornaTodasCarteiras(user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereCarteira(@Body() despesa: CarteirasDTO): Promise<Carteiras> {
    return this.carteiraService.insereCarteira(despesa);
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async deletaCarteira(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    return this.carteiraService.deletaCarteira(id);
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async alteraDespesa(
    @Param('id') id: number,
    @Body() despesa: CarteirasDTO,
  ): Promise<Carteiras> {
    return this.carteiraService.alteraCarteira(id, despesa);
  }
}
