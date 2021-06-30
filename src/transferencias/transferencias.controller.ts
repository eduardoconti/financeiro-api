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
@Controller('transferencias')
@ApiTags('transferencias')
@UseGuards(JwtAuthGuard)
export class TransferenciasController {
  constructor(private readonly transferenciaService: TransferenciaService) {}
  @Get()
  async retornaTodasTransferencias(
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaTodas(ano, mes, pago);
  }
  @Get('/id/:id')
  async retornaTransferenciaPoId(@Param('id') id?: number) {
    return await this.transferenciaService.getOne(id);
  }
  @Get('/:ano/mes/:mes')
  async retornaTodasTransferenciasAnoMes(
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaTodas(ano, mes, pago);
  }
  @Get('/:ano/mes/:mes/valor/origem')
  async retornaTodasTransferenciasAgrupadosOrigem(
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraOrigem(
      ano,
      mes,
      pago,
    );
  }
  @Get('/:ano/mes/:mes/valor/destino')
  async retornaTodasTransferenciasAgrupadosDestino(
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraDestino(
      ano,
      mes,
      pago,
    );
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @Param('id') id: number,
    @Body() transferencia: { id: number; pago: boolean },
  ): Promise<{ id: number; pago: boolean }> {
    return this.transferenciaService.alteraFlagPago(transferencia);
  }
  @Put('/:id')
  async alteraTransferencia(
    @Param('id') id: number,
    @Body() transferencia: TransferenciasDTO,
  ): Promise<Transferencias> {
    return this.transferenciaService.alteraTransferencia(transferencia, id);
  }
  @Delete('/:id')
  async deletaTransferencia(
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    return this.transferenciaService.deletaTransferencia(id);
  }
  @Post()
  async insereTransferencia(
    @Body() transferencia: TransferenciasDTO,
  ): Promise<Transferencias> {
    return this.transferenciaService.insereTransferencia(transferencia);
  }
}
