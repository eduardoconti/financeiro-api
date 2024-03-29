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
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';
import {
  FindTransferenceByQueryParamsDTO,
  TransferenceDeleteResponseDTO,
  TransferencePatchFlagPayedDTO,
  TransferenciasDTO,
} from './dto';
import { Transferencias } from './entity';
import {
  IDeleteTransferenceService,
  IGetTransferenceService,
  IInsertTransferenceService,
  IUpdateTransferenceService,
} from './service';

@Controller('transference')
@ApiTags('Transference')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TransferenceController {
  constructor(
    @Inject(TYPES.GetTransferenceService)
    private readonly getTransferenceService: IGetTransferenceService,
    @Inject(TYPES.InsertTransferenceService)
    private readonly insertTransferenceService: IInsertTransferenceService,
    @Inject(TYPES.UpdateTransferenceService)
    private readonly updateTransferenceService: IUpdateTransferenceService,
    @Inject(TYPES.DeleteTransferenceService)
    private readonly deleteTransferenceService: IDeleteTransferenceService,
  ) {}

  @Get()
  async getAll(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    const data = await this.getTransferenceService.getAllTransferencesByUser(
      user.userId,
      params.start,
      params.end,
      params.pago,
    );
    return new SuccessResponseData<Transferencias[]>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get(':id')
  async getById(
    @Param('id') id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.getTransferenceService.findOne({
      id,
      userId: user.userId,
    });
    return new SuccessResponseData<Transferencias>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values/origin')
  async getValuesGroupByOrigin(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ) {
    const data =
      await this.getTransferenceService.getTransferenceValuesGroupByWallet(
        user.userId,
        'origin',
        params.start,
        params.end,
        params.pago,
      );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Get('values/destiny')
  async getValuesGroupByDestiny(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ) {
    const data =
      await this.getTransferenceService.getTransferenceValuesGroupByWallet(
        user.userId,
        'destiny',
        params.start,
        params.end,
        params.pago,
      );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @Patch(':id')
  async updateFlagPayed(
    @Param('id') id: number,
    @Body() transference: TransferencePatchFlagPayedDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.updateTransferenceService.updateFlagPayed(
      id,
      user.userId,
      transference,
    );
    return new SuccessResponseData<Transferencias>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.TRANSFERENCE_UPDATE_SUCCESS,
    );
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() transference: TransferenciasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.updateTransferenceService.update(
      id,
      user.userId,
      transference,
    );
    return new SuccessResponseData<Transferencias>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.TRANSFERENCE_UPDATE_SUCCESS,
    );
  }

  @Delete(':id')
  async delete(
    @Param('id') id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<TransferenceDeleteResponseDTO>> {
    const data = await this.deleteTransferenceService.delete(id, user.userId);
    return new SuccessResponseData<TransferenceDeleteResponseDTO>(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.TRANSFERENCE_DELETE_SUCCESS,
    );
  }

  @Post()
  async insert(
    @Body() transference: TransferenciasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.insertTransferenceService.insert(
      transference,
      user.userId,
    );
    return new SuccessResponseData<Transferencias>(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.TRANSFERENCE_CREATE_SUCCESS,
    );
  }
}
