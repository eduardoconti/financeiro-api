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
import { User } from '@users/decorator';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { UserLoggedGuard } from '@users/guard';

import { TYPES } from '@config/dependency-injection';

import { CarteirasDTO } from './dto';
import { Carteiras } from './entity';
import {
  IDeleteWalletService,
  IGetWalletService,
  IInsertWalletService,
  IUpdateWalletService,
} from './service';

@Controller('carteiras')
@ApiTags('carteiras')
@UseGuards(JwtAuthGuard)
export class WalletController {
  constructor(
    @Inject(TYPES.CarteiraService)
    private readonly getWalletService: IGetWalletService,
    @Inject(TYPES.InsertWalletService)
    private readonly insertWalletService: IInsertWalletService,
    @Inject(TYPES.UpdateWalletService)
    private readonly updateWalletService: IUpdateWalletService,
    @Inject(TYPES.DeleteWalletService)
    private readonly deleteWalletService: IDeleteWalletService,
  ) {}

  @Get()
  @UseGuards(UserLoggedGuard)
  async getAll(@User() user: UserPayloadInterface): Promise<Carteiras[]> {
    return await this.getWalletService.getAllByUserId(user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insert(@Body() wallet: CarteirasDTO): Promise<Carteiras> {
    return this.insertWalletService.insertWallet(wallet);
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async delete(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.deleteWalletService.deleteWallet(id);
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async update(
    @Param('id') id: number,
    @Body() wallet: CarteirasDTO,
  ): Promise<Carteiras> {
    return this.updateWalletService.updateWallet(id, wallet);
  }
}
