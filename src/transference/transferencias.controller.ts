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
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

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
export class TransferenciasController {
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
  async retornaTodasTransferencias(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ): Promise<SuccessResponseData<Transferencias[]>> {
    const data = await this.getTransferenceService.getAllTransferencesByUser(
      user.userId,
      params.start,
      params.end,
      params.pago,
    );
    return new SuccessResponseData<Transferencias[]>(data);
  }

  @Get(':id')
  async retornaTransferenciaPoId(
    @Param('id') id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.getTransferenceService.findOne({
      id,
      userId: user.userId,
    });
    return new SuccessResponseData<Transferencias>(data);
  }

  @Get('values/origin')
  async retornaTodasTransferenciasAgrupadosOrigem(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ) {
    const data =
      await this.getTransferenceService.getTransferenceValuesGroupByWallet(
        'origin',
        user.userId,
        params.start,
        params.end,
        params.pago,
      );
    return new SuccessResponseData(data);
  }

  @Get('values/destiny')
  async retornaTodasTransferenciasAgrupadosDestino(
    @User() user: UserPayloadInterface,
    @Query() params: FindTransferenceByQueryParamsDTO,
  ) {
    const data =
      await this.getTransferenceService.getTransferenceValuesGroupByWallet(
        'destiny',
        user.userId,
        params.start,
        params.end,
        params.pago,
      );
    return new SuccessResponseData(data);
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @Param('id') id: number,
    @Body() transference: TransferencePatchFlagPayedDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.updateTransferenceService.updateFlagPayed(
      id,
      user.userId,
      transference,
    );
    return new SuccessResponseData<Transferencias>(data);
  }

  @Put(':id')
  async updateTransference(
    @Param('id') id: number,
    @Body() transference: TransferenciasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.updateTransferenceService.update(
      id,
      user.userId,
      transference,
    );
    return new SuccessResponseData<Transferencias>(data);
  }

  @Delete(':id')
  async deleteTransference(
    @Param('id') id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<TransferenceDeleteResponseDTO>> {
    const data = await this.deleteTransferenceService.delete(id, user.userId);
    return new SuccessResponseData<TransferenceDeleteResponseDTO>(data);
  }

  @Post()
  async insertTransference(
    @Body() transference: TransferenciasDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Transferencias>> {
    const data = await this.insertTransferenceService.insert(
      transference,
      user.userId,
    );
    return new SuccessResponseData<Transferencias>(data);
  }
}
