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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

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
@ApiTags('Wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  async getAll(@User() user: UserPayloadInterface): Promise<Carteiras[]> {
    return await this.getWalletService.getAllByUserId(user.userId);
  }

  @Post()
  async insert(@Body() wallet: CarteirasDTO): Promise<Carteiras> {
    return this.insertWalletService.insertWallet(wallet);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.deleteWalletService.deleteWallet(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() wallet: CarteirasDTO,
  ): Promise<Carteiras> {
    return this.updateWalletService.updateWallet(id, wallet);
  }
}
