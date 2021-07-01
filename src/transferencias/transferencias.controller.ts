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

@Controller('transferencias')
@ApiTags('transferencias')
@UseGuards(JwtAuthGuard)
export class TransferenciasController {
  constructor(private readonly transferenciaService: TransferenciaService) {}
  @Get()
  async retornaTodasTransferencias(
    @User() user: UserPayloadInterface,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaTodas(ano, mes, pago, user.userId);
  }
  @Get('/id/:id')
  async retornaTransferenciaPoId(@Param('id') id?: number) {
    return await this.transferenciaService.getOne(id);
  }
  @Get('/:ano/mes/:mes')
  async retornaTodasTransferenciasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaTodas(ano, mes, pago, user.userId);
  }
  @Get('/:ano/mes/:mes/valor/origem')
  async retornaTodasTransferenciasAgrupadosOrigem(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraOrigem(
      ano,
      mes,
      pago,
      user.userId
    );
  }
  @Get('/:ano/mes/:mes/valor/destino')
  async retornaTodasTransferenciasAgrupadosDestino(
    @User() user: UserPayloadInterface,
    @Param('ano') ano?: number,
    @Param('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.transferenciaService.retornaValorDespesasAgrupadosPorCarteiraDestino(
      ano,
      mes,
      pago,
      user.userId
    );
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() transferencia: { id: number; pago: boolean },
  ): Promise<{ id: number; pago: boolean }> {
    return this.transferenciaService.alteraFlagPago(id, transferencia, user.userId);
  }
  @Put('/:id')
  async alteraTransferencia(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() transferencia: TransferenciasDTO,
  ): Promise<Transferencias> {
    return this.transferenciaService.alteraTransferencia(id,transferencia, user.userId);
  }
  @Delete('/:id')
  async deletaTransferencia(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    return this.transferenciaService.deletaTransferencia(id, user.userId);
  }
  @Post()
  @UseGuards(UserLoggedGuard)
  async insereTransferencia(
    @Body() transferencia: TransferenciasDTO,
  ): Promise<Transferencias> {
    return this.transferenciaService.insereTransferencia(transferencia);
  }
}
