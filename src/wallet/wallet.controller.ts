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
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';
import {
  CarteirasDeleteResponseDTO,
  CarteirasDTO,
  UpdateWalletRequest,
  WalletResponse,
} from './dto';
import { Carteiras } from './entity';
import {
  IDeleteWalletService,
  IGetWalletService,
  IInsertWalletService,
  IUpdateWalletService,
  UpdateWalletServiceInput,
} from './service';

@Controller('wallet')
@ApiTags('Wallets')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(
    @Inject(TYPES.GetWalletService)
    private readonly getWalletService: IGetWalletService,
    @Inject(TYPES.InsertWalletService)
    private readonly insertWalletService: IInsertWalletService,
    @Inject(TYPES.UpdateWalletService)
    private readonly updateWalletService: IUpdateWalletService,
    @Inject(TYPES.DeleteWalletService)
    private readonly deleteWalletService: IDeleteWalletService,
  ) {}

  @Get()
  async getAll(
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Carteiras[]>> {
    const data = await this.getWalletService.getAllByUserId(user.userId);
    return new SuccessResponseData<Carteiras[]>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Post()
  async insert(
    @Body() wallet: CarteirasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Carteiras>> {
    const data = await this.insertWalletService.insertWallet({
      ...wallet,
      userId: user.userId,
    });
    return new SuccessResponseData<Carteiras>(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.WALLET_CREATE_SUCCESS,
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<CarteirasDeleteResponseDTO>> {
    const data = await this.deleteWalletService.deleteWallet(id, user.userId);
    return new SuccessResponseData<CarteirasDeleteResponseDTO>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.WALLET_DELETE_SUCCESS,
    );
  }

  @Put(':id')
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @User() { userId }: UserPayloadInterface,
    @Body() { active, description }: UpdateWalletRequest,
  ): Promise<SuccessResponseData<WalletResponse>> {
    const serviceInput: UpdateWalletServiceInput = {
      id,
      userId,
      active,
      description,
    };
    const updated = await this.updateWalletService.updateWallet(serviceInput);
    return new SuccessResponseData<WalletResponse>(
      { id, active: updated.active, descricao: updated.descricao },
      HttpStatus.OK,
      SUCCESS_MESSAGES.WALLET_UPDATE_SUCCESS,
    );
  }
}
