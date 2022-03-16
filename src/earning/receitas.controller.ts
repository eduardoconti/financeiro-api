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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { YIELD_SUCCESS_MESSAGES } from './constants';
import {
  EarningDeleteResponseDTO,
  EarningPatchFlagPayedDTO,
  FindEarningByQueryParamsDTO,
  GetEarningAmountGroupByWalletResponse,
  GetTotalEarningResponseDTO,
  ReceitasDTO,
} from './dto';
import { Receitas } from './entity';
import {
  IDeleteEarningService,
  IGetEarningService,
  IInsertEarningService,
  IUpdateEarningService,
} from './service';
import { EarningGroupMonth } from './types';

@Controller('earnings')
@ApiTags('Earnings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReceitasController {
  constructor(
    @Inject(TYPES.InsertEarningService)
    private readonly insertEarningService: IInsertEarningService,
    @Inject(TYPES.UpdateEarningService)
    private readonly updateEarningService: IUpdateEarningService,
    @Inject(TYPES.DeleteEarningService)
    private readonly deleteteEarningService: IDeleteEarningService,
    @Inject(TYPES.GetEarningService)
    private readonly getEarningService: IGetEarningService,
  ) {}

  @Get()
  async retornaTodasReceitas(
    @User() user: UserPayloadInterface,
    @Query() params: FindEarningByQueryParamsDTO,
  ): Promise<SuccessResponseData<Receitas[]>> {
    const data = await this.getEarningService.getAllEarningsByUser(
      user.userId,
      params.start,
      params.end,
      params.pago,
    );
    return new SuccessResponseData<Receitas[]>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values')
  async retornaTotalReceitasRecebidas(
    @User() user: UserPayloadInterface,
    @Query() params: FindEarningByQueryParamsDTO,
  ): Promise<SuccessResponseData<GetTotalEarningResponseDTO>> {
    const data = await this.getEarningService.getTotalEarnings(
      user.userId,
      params.start,
      params.end,
    );
    return new SuccessResponseData<GetTotalEarningResponseDTO>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('month')
  async retornaReceitasAgrupadasPorMes(
    @User() user: UserPayloadInterface,
    @Query() params: FindEarningByQueryParamsDTO,
  ): Promise<SuccessResponseData<EarningGroupMonth>> {
    const data = await this.getEarningService.getEarningsGroupByMonth(
      user.userId,
      params.start,
      params.end,
    );
    return new SuccessResponseData<EarningGroupMonth>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values/wallet')
  async GetEarningsValuesGroupByWallet(
    @User() user: UserPayloadInterface,
    @Query() params: FindEarningByQueryParamsDTO,
  ): Promise<SuccessResponseData<GetEarningAmountGroupByWalletResponse[]>> {
    const data = await this.getEarningService.getEarningValuesGroupByWallet(
      user.userId,
      params.start,
      params.end,
      params.pago,
    );
    return new SuccessResponseData<GetEarningAmountGroupByWalletResponse[]>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get(':id')
  async getEarningById(
    @User() user: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.getEarningService.findOne({
      id,
      userId: user.userId,
    });
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch(':id')
  async alteraFlagPago(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
    @Body() receita: EarningPatchFlagPayedDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.updateEarningService.updateFlagPayed(
      id,
      user.userId,
      receita,
    );
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Put(':id')
  async updateExpense(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
    @Body() receita: ReceitasDTO,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.updateEarningService.update(
      id,
      user.userId,
      receita,
    );
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_UPDATE_SUCCESS,
    );
  }

  @Delete(':id')
  async deleteExpense(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<EarningDeleteResponseDTO>> {
    const data = await this.deleteteEarningService.delete(id, user.userId);
    return new SuccessResponseData<EarningDeleteResponseDTO>(
      data,
      HttpStatus.OK,
      YIELD_SUCCESS_MESSAGES.YIELD_DELETE_SUCCESS,
    );
  }

  @Post()
  async insertExpense(
    @Body() receita: ReceitasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Receitas>> {
    const data = await this.insertEarningService.insert(receita, user.userId);
    return new SuccessResponseData<Receitas>(
      data,
      HttpStatus.CREATED,
      YIELD_SUCCESS_MESSAGES.YIELD_CREATE_SUCCESS,
    );
  }
}
