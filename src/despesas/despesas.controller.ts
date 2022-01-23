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
  ParseIntPipe,
} from '@nestjs/common';

import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';
import { JwtAuthGuard } from '@auth/guard';
import { User } from '@shared/decorator';
import { UserPayloadInterface } from '@auth/interfaces';
import { SuccessResponseData } from '@shared/dto';
import { DespesaService } from './service';
import { Despesas } from './entity';
import { SUCCESS_MESSAGES } from './constants';
import { DespesasDTO, ExpensePatchFlagPayedDto } from './dto';
import { ExpenseDeletedResponse } from './interface';
import { UserLoggedGuard } from 'src/users/guard';
@Controller('despesas')
@ApiTags('despesas')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(private readonly despesaService: DespesaService) { }

  @Get()
  @ApiQuery({ name: 'ano', required: false, example: new Date().getFullYear() })
  @ApiQuery({ name: 'mes', required: false, example: new Date().getMonth() })
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTodasDespesas(
    @User() user: UserPayloadInterface,
    @Query('ano', ParseIntPipe) ano?: number,
    @Query('mes', ParseIntPipe) mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Despesas[]>> {
    let data = await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData<Despesas[]>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/total')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTotalDespesas(
    @User() user: UserPayloadInterface,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<number>> {
    let data = await this.despesaService.retornaTotalDespesas(
      0,
      0,
      pago,
      user.userId,
    );

    return new SuccessResponseData<number>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaDespesasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Query('pago') pago?: boolean,
  ) {
    let data = await this.despesaService.retornaDespesasAgrupadasPorMes(
      ano,
      pago,
      user.userId,
    );

    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaDespesasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes/categoria/valor')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaValorDespesasAgrupadosPorCategoria(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaValorDespesasAgrupadosPorCategoria(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes/carteira/valor')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaValorDespesasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaValorDespesasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/:ano/mes/:mes/total')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async getTotalDespesas(
    @User() user: UserPayloadInterface,
    @Param('ano', ParseIntPipe) ano: number,
    @Param('mes', ParseIntPipe) mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaTotalDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('/id/:id')
  async getById(
    @User() userToken: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<Despesas>> {
    let res = await this.despesaService.getOne(id, userToken.userId);
    return new SuccessResponseData<Despesas>(
      res,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: ExpensePatchFlagPayedDto,
  ): Promise<SuccessResponseData<Despesas>> {
    let data = await this.despesaService.alteraFlagPago(
      id,
      despesa,
      user.userId,
    );
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }

  @Put('/:id')
  async alteraDespesa(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: DespesasDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    let data = await this.despesaService.alteraDespesa(
      id,
      despesa,
      user.userId,
    );
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }

  @Delete('/:id')
  async deletaDespesa(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<ExpenseDeletedResponse>> {
    let data = await this.despesaService.deletaDespesa(id, user.userId);
    return new SuccessResponseData<ExpenseDeletedResponse>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_DELETE_SUCCESS,
    );
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereDespesa(
    @Body() despesa: DespesasDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    let data = await this.despesaService.insereDespesa(despesa);
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.EXPENSE_CREATE_SUCCESS,
    );
  }
}
