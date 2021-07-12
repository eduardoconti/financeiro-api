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
} from '@nestjs/common';

import { TransferenciasDTO } from './dto/transferencias.dto';
import { Transferencias } from './entity/transferencias.entity';
import { ApiTags } from '@nestjs/swagger';
import { TransferenciaService } from './service/transferencias.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';
import { SuccessResponseData } from 'src/shared/dto/success-response-data.dto'

@Controller('transferencias')
@ApiTags('transferencias')
@UseGuards(JwtAuthGuard)

export class TransferenciasController {
  constructor(private readonly transferenciaService: TransferenciaService) { }
  @Get()
  async retornaTodasTransferencias(
    @User() user: UserPayloadInterface,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    let data = await this.transferenciaService.retornaTodas(ano, mes, pago, user.userId);
    return new SuccessResponseData<Transferencias[]>(data);
  }

  @Get('/id/:id')
  async retornaTransferenciaPoId(@Param('id') id?: number): Promise<SuccessResponseData<Transferencias>> {
    let data = await this.transferenciaService.getOne(id);
    return new SuccessResponseData<Transferencias>(data);
  }

  @Get('/:ano/mes/:mes')
  async retornaTodasTransferenciasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    let data = await this.transferenciaService.retornaTodas(ano, mes, pago, user.userId);
    return new SuccessResponseData<Transferencias[]>(data);
  }

  @Get('/:ano/mes/:mes/valor/origem')
  async retornaTodasTransferenciasAgrupadosOrigem(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    let data = await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraOrigem(
      ano,
      mes,
      pago,
      user.userId
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
    let data = await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraDestino(
      ano,
      mes,
      pago,
      user.userId
    );
    return new SuccessResponseData(data);
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() transferencia: { id: number; pago: boolean },
  ): Promise<SuccessResponseData<{ id: number; pago: boolean }>> {
    let data = this.transferenciaService.alteraFlagPago(id, transferencia, user.userId);
    return new SuccessResponseData<{ id: number; pago: boolean }>(data);
  }

  @Put('/:id')
  async alteraTransferencia(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() transferencia: TransferenciasDTO,
  ): Promise<SuccessResponseData<Transferencias>> {
    let data = this.transferenciaService.alteraTransferencia(id, transferencia, user.userId);
    return new SuccessResponseData<Transferencias>(data);
  }

  @Delete('/:id')
  async deletaTransferencia(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<SuccessResponseData<{ deleted: boolean }>> {
    let data = this.transferenciaService.deletaTransferencia(id, user.userId);
    return new SuccessResponseData<{ deleted: boolean }>(data);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereTransferencia(
    @Body() transferencia: TransferenciasDTO,
  ): Promise<SuccessResponseData<Transferencias>> {
    let data = this.transferenciaService.insereTransferencia(transferencia);
    return new SuccessResponseData<Transferencias>(data);
  }
}
