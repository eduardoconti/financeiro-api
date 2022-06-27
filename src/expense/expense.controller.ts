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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';
import {
  DespesasDTO,
  ExpenseDeleteResponseDTO,
  ExpensePatchFlagPayedDTO,
  FindExpenseByQueryParamsDTO,
  GetExpenseAmountGroupByCategoryResponse,
  GetExpenseAmountGroupByWalletResponse,
  GetTotalExpenseResponseDTO,
} from './dto';
import { Despesas } from './entity';
import {
  IDeleteExpenseService,
  IGetExpenseService,
  IInsertExpenseService,
} from './service';
import { IUpdateExpenseService } from './service/update-expense.service.interface';
import { ExpenseGroupMonth } from './types';

@Controller('expense')
@ApiTags('Expenses')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExpenseController {
  constructor(
    @Inject(TYPES.UpdateExpenseService)
    private readonly updateExpenseService: IUpdateExpenseService,
    @Inject(TYPES.GetExpenseService)
    private readonly getExpenseService: IGetExpenseService,
    @Inject(TYPES.InsertExpenseService)
    private readonly insertExpenseService: IInsertExpenseService,
    @Inject(TYPES.DeleteExpenseService)
    private readonly deleteExpenseService: IDeleteExpenseService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all expenses.',
    description: 'Return all user expenses.',
  })
  async getAllExpenses(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<Despesas[]>> {
    const { start, end, pago } = params;
    const data = await this.getExpenseService.getAllExpensesByUser(
      user.userId,
      start,
      end,
      pago,
    );

    return new SuccessResponseData<Despesas[]>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values')
  @ApiOperation({
    summary: 'Get expenses values.',
    description: 'Return total amount of all expenses.',
  })
  async getExpensesValues(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<GetTotalExpenseResponseDTO>> {
    const { start, end } = params;
    const data = await this.getExpenseService.getTotalExpenses(
      user.userId,
      start,
      end,
    );

    return new SuccessResponseData<GetTotalExpenseResponseDTO>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values/category')
  @ApiOperation({
    summary: 'Get expenses values grouped by category.',
    description: 'Return total amount of all expenses grouped by category.',
  })
  async getExpensesValuesGroupByCategory(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<GetExpenseAmountGroupByCategoryResponse[]>> {
    const { start, end, pago } = params;
    const data = await this.getExpenseService.getExpenseValuesGroupByCategory(
      user.userId,
      start,
      end,
      pago,
    );

    return new SuccessResponseData<GetExpenseAmountGroupByCategoryResponse[]>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values/wallet')
  @ApiOperation({
    summary: 'Get expenses values grouped by wallet.',
    description: 'Return total amount of all expenses grouped by wallet.',
  })
  async getExpensesValuesGroupByWallet(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<GetExpenseAmountGroupByWalletResponse[]>> {
    const { start, end, pago } = params;
    const data = await this.getExpenseService.getExpenseValuesGroupByWallet(
      user.userId,
      start,
      end,
      pago,
    );

    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('month')
  @ApiOperation({
    summary: 'Get expenses values grouped by month.',
    description: 'Return total amount of all expenses grouped by month.',
  })
  async getExpensesValuesGroupByMonth(
    @User() user: UserPayloadInterface,
    @Query() params: FindExpenseByQueryParamsDTO,
  ): Promise<SuccessResponseData<ExpenseGroupMonth>> {
    const { start, end } = params;
    const data = await this.getExpenseService.getExpensesGroupByMonth(
      user.userId,
      start,
      end,
    );

    return new SuccessResponseData<ExpenseGroupMonth>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get expenses by id.',
    description: 'Return expense by id.',
  })
  async getExpenseById(
    @User() userToken: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<Despesas>> {
    const res = await this.getExpenseService.findOne({
      id,
      userId: userToken.userId,
    });
    return new SuccessResponseData<Despesas>(
      res,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }
  @ApiOperation({
    summary: 'Update flag payed.',
    description: 'Change flag payed if different from request.',
  })
  @Patch('flag/:id')
  async updateFlagPayed(
    @User() userToken: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: ExpensePatchFlagPayedDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    const data = await this.updateExpenseService.updateFlagPayed(
      id,
      userToken.userId,
      despesa,
    );
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }
  @ApiOperation({
    summary: 'Update expense.',
    description: 'Change expense.',
  })
  @Put(':id')
  async update(
    @User() userToken: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
    @Body() despesa: Partial<DespesasDTO>,
  ): Promise<SuccessResponseData<Despesas>> {
    const data = await this.updateExpenseService.update(
      id,
      userToken.userId,
      despesa,
    );
    return new SuccessResponseData<Despesas>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_UPDATE_SUCCESS,
    );
  }
  @ApiOperation({
    summary: 'Delete expense.',
    description: 'Remove expense.',
  })
  @Delete(':id')
  async delete(
    @User() userToken: UserPayloadInterface,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseData<ExpenseDeleteResponseDTO>> {
    const data = await this.deleteExpenseService.delete(id, userToken.userId);
    return new SuccessResponseData<ExpenseDeleteResponseDTO>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.EXPENSE_DELETE_SUCCESS,
    );
  }
  @ApiOperation({
    summary: 'Insert expense.',
    description: 'Create new expense.',
  })
  @Post()
  async insertExpense(
    @Body() despesa: DespesasDTO,
    @User() userToken: UserPayloadInterface,
  ): Promise<SuccessResponseData<Despesas | Despesas[]>> {
    const data = await this.insertExpenseService.insert(
      despesa,
      userToken.userId,
    );
    return new SuccessResponseData<Despesas | Despesas[]>(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.EXPENSE_CREATE_SUCCESS,
    );
  }
}
