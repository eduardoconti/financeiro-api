import {
  Controller,
  Get,
  Param,
  Put,
  Body,
  Delete,
  Post,
  Patch,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { DespesaService } from './service/despesas.service';
import { Despesas } from './entity/despesas.entity';
import { DespesasDTO } from './dto/despesas.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@Controller('despesas')
@ApiTags('despesas')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(private readonly despesaService: DespesaService) {}

  @Get()
  @ApiQuery({ name: 'ano', required: false, example: new Date().getFullYear() })
  @ApiQuery({ name: 'mes', required: false, example: new Date().getMonth() })
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTodasDespesas(
    @User() user: UserPayloadInterface,
    @Query('ano', ParseIntPipe) ano?: number,
    @Query('mes', ParseIntPipe) mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<Despesas[]> {
    return await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
  }

  @Get('/total')
  async retornaTotalDespesas(
    @User() user: UserPayloadInterface,
    @Query('pago') pago?: boolean,
  ): Promise<number> {
    return await this.despesaService.retornaTotalDespesas(
      0,
      0,
      pago,
      user.userId,
    );
  }

  @Get('/:ano/mes')
  async retornaDespesasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.despesaService.retornaDespesasAgrupadasPorMes(
      ano,
      pago,
      user.userId,
    );
  }

  @Get('/:ano/mes/:mes')
  async retornaDespesasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
  }

  @Get('/:ano/mes/:mes/categoria/valor')
  async retornaValorDespesasAgrupadosPorCategoria(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.despesaService.retornaValorDespesasAgrupadosPorCategoria(
      ano,
      mes,
      pago,
      user.userId,
    );
  }

  @Get('/:ano/mes/:mes/carteira/valor')
  async retornaValorDespesasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.despesaService.retornaValorDespesasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId,
    );
  }

  @Get('/:ano/mes/:mes/total')
  async getTotalDespesas(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return this.despesaService.retornaTotalDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
  }

  @Get('/id/:id')
  async getById(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<Despesas> {
    return this.despesaService.getOne(id, user.userId);
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() despesa,
  ): Promise<Despesas> {
    return this.despesaService.alteraFlagPago(id, despesa, user.userId);
  }

  @Put('/:id')
  async alteraDespesa(
    @Param('id') id: number,
    @Body() despesa: DespesasDTO,
  ): Promise<Despesas> {
    return this.despesaService.alteraDespesa(id, despesa);
  }

  @Delete('/:id')
  async deletaDespesa(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    return this.despesaService.deletaDespesa(id, user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereDespesa(@Body() despesa: DespesasDTO): Promise<Despesas> {
    return this.despesaService.insereDespesa(despesa);
  }
}
