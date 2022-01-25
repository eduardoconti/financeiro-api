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
  Inject,
} from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { User } from '@users/decorator';
import { SuccessResponseData } from '@shared/dto';
import { UserLoggedGuard } from 'src/users/guard';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { TYPES } from '@config/dependency-injection';

import { SUCCESS_MESSAGES } from './constants';
import { DespesasDTO, ExpensePatchFlagPayedDTO } from './dto';
import { Despesas } from './entity';
import { ExpenseDeletedResponse } from './interface';
import { IExpenseService } from './service/expense.service.interface';

@Controller('despesas')
@ApiTags('Expenses')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(
    @Inject(TYPES.ExpenseService)
    private readonly despesaService: IExpenseService,
  ) {}

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
    const data = await this.despesaService.retornaTodasDespesas(
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
    const data = await this.despesaService.retornaTotalDespesas(
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
    const data = await this.despesaService.retornaDespesasAgrupadasPorMes(
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
    const data = await this.despesaService.retornaTodasDespesas(
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
    const data =
      await this.despesaService.retornaValorDespesasAgrupadosPorCategoria(
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
    const data =
      await this.despesaService.retornaValorDespesasAgrupadosPorCarteira(
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
    const data = await this.despesaService.retornaTotalDespesas(
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
    const res = await this.despesaService.getOne(id, userToken.userId);
    return new SuccessResponseData<Despesas>(
      res,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch('flag/:id')
  @UseGuards(UserLoggedGuard)
  async alteraFlagPago(
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: ExpensePatchFlagPayedDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    const data = await this.despesaService.alteraFlagPago(id, despesa);
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async alteraDespesa(
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: DespesasDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    const data = await this.despesaService.alteraDespesa(id, despesa);
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async deletaDespesa(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<ExpenseDeletedResponse>> {
    const data = await this.despesaService.deletaDespesa(id);
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
    const data = await this.despesaService.insereDespesa(despesa);
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.EXPENSE_CREATE_SUCCESS,
    );
  }
}
