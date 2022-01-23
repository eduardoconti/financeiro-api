import {
  Controller,
  Get,
  Param,
  Patch,
  Query,
  Body,
  Put,
  Delete,
  Post,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@shared/decorator';
import { SuccessResponseData } from '@shared/dto';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { UserLoggedGuard } from '@users/guard';

import { TYPES } from '@config/dependency-injection';

import {
  TransferenceDeleteResponseDTO,
  TransferencePathFlagPayedDTO,
  TransferenciasDTO,
} from './dto';
import { Transferencias } from './entity';
import { ITransferenceService } from './service';

@Controller('transferencias')
@ApiTags('transferencias')
@UseGuards(JwtAuthGuard)
export class TransferenciasController {
  constructor(
    @Inject(TYPES.TransferenceService)
    private readonly transferenciaService: ITransferenceService,
  ) {}
  @Get()
  async retornaTodasTransferencias(
    @User() user: UserPayloadInterface,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    const data = await this.transferenciaService.retornaTodas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData<Transferencias[]>(data);
  }

  @Get('/id/:id')
  async retornaTransferenciaPoId(
    @Param('id') id: number,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.transferenciaService.getOne(id);
    return new SuccessResponseData<Transferencias>(data);
  }

  @Get('/:ano/mes/:mes')
  async retornaTodasTransferenciasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    const data = await this.transferenciaService.retornaTodas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData<Transferencias[]>(data);
  }

  @Get('/:ano/mes/:mes/valor/origem')
  async retornaTodasTransferenciasAgrupadosOrigem(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    const data = await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraOrigem(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(data);
  }

  @Get('/:ano/mes/:mes/valor/destino')
  async retornaTodasTransferenciasAgrupadosDestino(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    const data = await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraDestino(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(data);
  }

  @Patch('flag/:id')
  @UseGuards(UserLoggedGuard)
  async alteraFlagPago(
    @Param('id') id: number,
    @Body() transferencia: TransferencePathFlagPayedDTO,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.transferenciaService.alteraFlagPago(
      id,
      transferencia,
    );
    return new SuccessResponseData<Transferencias>(data);
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async alteraTransferencia(
    @Param('id') id: number,
    @Body() transferencia: TransferenciasDTO,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.transferenciaService.alteraTransferencia(
      id,
      transferencia,
    );
    return new SuccessResponseData<Transferencias>(data);
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async deletaTransferencia(
    @Param('id') id: number,
  ): Promise<SuccessResponseData<TransferenceDeleteResponseDTO>> {
    const data = await this.transferenciaService.deletaTransferencia(id);
    return new SuccessResponseData<TransferenceDeleteResponseDTO>(data);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereTransferencia(
    @Body() transferencia: TransferenciasDTO,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.transferenciaService.insereTransferencia(
      transferencia,
    );
    return new SuccessResponseData<Transferencias>(data);
  }
}
