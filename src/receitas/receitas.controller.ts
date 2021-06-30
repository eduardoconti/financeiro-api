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
} from '@nestjs/common';
import { ReceitaService } from './service/receitas.service';
import { Receitas } from './entity/receitas.entity';
import { ReceitasDTO } from './dto/receitas.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';

@Controller('receitas')
@ApiTags('receitas')
@UseGuards(JwtAuthGuard)
export class ReceitasController {
  constructor(private readonly receitaService: ReceitaService) {}

  @Get()
  async retornaTodasReceitas(
    @User() user: UserPayloadInterface,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ) {
    return await this.receitaService.retornaTodasReceitas(ano, mes, pago, user.userId);
  }
  @Get('/total')
  async retornaTotalReceitasRecebidas(
    @User() user: UserPayloadInterface,
    @Query('pago') pago: boolean) {
    return this.receitaService.retornaTotalReceitas(0, 0, pago, user.userId);
  }
  @Get('/:ano/mes')
  async retornaReceitasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.receitaService.retornaDespesasAgrupadasPorMes(ano, pago, user.userId);
  }
  @Get('/:ano/mes/:mes')
  async retornaReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.receitaService.retornaTodasReceitas(ano, mes, pago, user.userId);
  }
  @Get('/:ano/mes/:mes/carteira/valor')
  async retornaValorReceitasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return await this.receitaService.retornaValorReceitasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId
    );
  }
  @Get('/:ano/mes/:mes/total')
  async getTotalReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    return this.receitaService.retornaTotalReceitas(ano, mes, pago, user.userId);
  }
  @Get('/id/:id')
  async getById(
    @User() user: UserPayloadInterface,
    @Param('id') id: number ): Promise<Receitas> {
    return this.receitaService.getOne(id, user.userId);
  }
  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() receita,
  ): Promise<{ id: number; pago: boolean }> {
    return this.receitaService.alteraFlagPago(receita, id, user.userId);
  }
  @Put('/:id')
  async alteraReceita(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() receita: ReceitasDTO,
  ): Promise<Receitas> {
    return this.receitaService.alteraReceita(receita, id, user.userId);
  }
  @Delete('/:id')
  async deletaReceita(
    @User() user: UserPayloadInterface,
    @Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.receitaService.deletaReceita(id, user.userId);
  }
  @Post()
  async insereReceita(@Body() receita: ReceitasDTO): Promise<Receitas> {
    return this.receitaService.insereReceita(receita);
  }
}
