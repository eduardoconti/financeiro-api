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
  HttpStatus,
  ParseIntPipe,
  Inject,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@shared/decorator';
import { SuccessResponseData } from '@shared/dto';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { UserLoggedGuard } from '@users/guard';

import { TYPES } from '@config/dependency-injection';

import { YIELD_SUCCESS_MESSAGES } from './constants';
import { ReceitasDTO } from './dto';
import { Receitas } from './entity';
import { IEarningService } from './service';

@Controller('receitas')
@ApiTags('receitas')
@UseGuards(JwtAuthGuard)
export class ReceitasController {
  constructor(
    @Inject(TYPES.EarningService)
    private readonly receitaService: IEarningService,
  ) {}

  @Get()
  @ApiQuery({ name: 'ano', required: false, example: new Date().getFullYear() })
  @ApiQuery({ name: 'mes', required: false, example: new Date().getMonth() })
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTodasReceitas(
    @User() user: UserPayloadInterface,
    @Query('ano', ParseIntPipe) ano?: number,
    @Query('mes', ParseIntPipe) mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Receitas[]>> {
    const data = await this.receitaService.retornaTodasReceitas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData<Receitas[]>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/total')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTotalReceitasRecebidas(
    @User() user: UserPayloadInterface,
    @Query('pago') pago: boolean,
  ) {
    const data = await this.receitaService.retornaTotalReceitas(
      0,
      0,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaReceitasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Query('pago') pago: boolean,
  ) {
    const data = await this.receitaService.retornaReceitasAgrupadasPorMes(
      ano,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    const data = await this.receitaService.retornaTodasReceitas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes/carteira/valor')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaValorReceitasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    const data = await this.receitaService.retornaValorReceitasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes/total')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async getTotalReceitasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    const data = await this.receitaService.retornaTotalReceitas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/id/:id')
  @UseGuards(UserLoggedGuard)
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.receitaService.getOne(id);
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch('flag/:id')
  @UseGuards(UserLoggedGuard)
  async alteraFlagPago(
    @Param('id', ParseIntPipe) id: number,
    @Body() receita,
  ): Promise<SuccessResponseData<{ id: number; pago: boolean }>> {
    const data = await this.receitaService.alteraFlagPago(receita, id);
    return new SuccessResponseData<{ id: number; pago: boolean }>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async alteraReceita(
    @Param('id', ParseIntPipe) id: number,
    @Body() receita: ReceitasDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.receitaService.alteraReceita(receita, id);
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async deletaReceita(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<{ deleted: boolean }>> {
    const data = await this.receitaService.deletaReceita(id);
    return new SuccessResponseData<{ deleted: boolean }>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_DELETE_SUCCESS,
    );
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereReceita(
    @Body() receita: ReceitasDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.receitaService.insereReceita(receita);
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.CREATED,
      YIELD_SUCCESS_MESSAGES.YIELD_CREATE_SUCCESS,
    );
  }
}
