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
import { SuccessResponseData } from 'src/shared/dto/success-response-data.dto'
@Controller('receitas')
@ApiTags('receitas')
@UseGuards(JwtAuthGuard)

export class ReceitasController {
  constructor(private readonly receitaService: ReceitaService) { }

  @Get()
  async retornaTodasReceitas(
    @User() user: UserPayloadInterface,
    @Query('ano') ano?: number,
    @Query('mes') mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Receitas[]>> {
    let data = await this.receitaService.retornaTodasReceitas(ano, mes, pago, user.userId);
    return new SuccessResponseData<Receitas[]>(data);
  }

  @Get('/total')
  async retornaTotalReceitasRecebidas(
    @User() user: UserPayloadInterface,
    @Query('pago') pago: boolean) {
    let data = await this.receitaService.retornaTotalReceitas(0, 0, pago, user.userId);
    return new SuccessResponseData(data);
  }

  @Get('/:ano/mes')
  async retornaReceitasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.receitaService.retornaDespesasAgrupadasPorMes(ano, pago, user.userId);
    return new SuccessResponseData(data);
  }

  @Get('/:ano/mes/:mes')
  async retornaReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.receitaService.retornaTodasReceitas(ano, mes, pago, user.userId);
    return new SuccessResponseData(data);
  }

  @Get('/:ano/mes/:mes/carteira/valor')
  async retornaValorReceitasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.receitaService.retornaValorReceitasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId
    );
    return new SuccessResponseData(data);
  }

  @Get('/:ano/mes/:mes/total')
  async getTotalReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.receitaService.retornaTotalReceitas(ano, mes, pago, user.userId);
    return new SuccessResponseData(data);
  }

  @Get('/id/:id')
  async getById(
    @User() user: UserPayloadInterface,
    @Param('id') id: number): Promise<SuccessResponseData<Receitas>> {
    let data = await this.receitaService.getOne(id, user.userId);
    return new SuccessResponseData<Receitas>(data);
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() receita,
  ): Promise<SuccessResponseData<{ id: number; pago: boolean }>> {
    let data = await this.receitaService.alteraFlagPago(receita, id, user.userId);
    return new SuccessResponseData<{ id: number; pago: boolean }>(data)
  }

  @Put('/:id')
  async alteraReceita(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() receita: ReceitasDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    let data = await this.receitaService.alteraReceita(receita, id, user.userId);
    return new SuccessResponseData<Receitas>(data)
  }

  @Delete('/:id')
  async deletaReceita(
    @User() user: UserPayloadInterface,
    @Param('id') id: number): Promise<SuccessResponseData<{ deleted: boolean }>> {
    let data = await this.receitaService.deletaReceita(id, user.userId);
    return new SuccessResponseData<{ deleted: boolean }>(data)
  }

  @Post()
  async insereReceita(@Body() receita: ReceitasDTO): Promise<SuccessResponseData<Receitas>> {
    let data = await this.receitaService.insereReceita(receita);
    return new SuccessResponseData<Receitas>(data)
  }
}
