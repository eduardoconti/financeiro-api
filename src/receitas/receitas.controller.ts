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
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { User } from 'src/shared/decorator/user.decorator';
import { SuccessResponseData } from 'src/shared/dto/success-response-data.dto';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';

import { YIELD_SUCCESS_MESSAGES } from './constants/messages.constants';
import { ReceitasDTO } from './dto/receitas.dto';
import { Receitas } from './entity/receitas.entity';
import { ReceitaService } from './service/receitas.service';
@Controller('receitas')
@ApiTags('receitas')
@UseGuards(JwtAuthGuard)
export class ReceitasController {
  constructor(private readonly receitaService: ReceitaService) {}

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
  async getById(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.receitaService.getOne(id, user.userId);
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() receita,
  ): Promise<SuccessResponseData<{ id: number; pago: boolean }>> {
    const data = await this.receitaService.alteraFlagPago(
      receita,
      id,
      user.userId,
    );
    return new SuccessResponseData<{ id: number; pago: boolean }>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Put('/:id')
  async alteraReceita(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() receita: ReceitasDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.receitaService.alteraReceita(
      receita,
      id,
      user.userId,
    );
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Delete('/:id')
  async deletaReceita(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<{ deleted: boolean }>> {
    const data = await this.receitaService.deletaReceita(id, user.userId);
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
