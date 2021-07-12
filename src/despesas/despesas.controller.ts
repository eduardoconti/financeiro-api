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
import { DespesaService } from './service/despesas.service';
import { Despesas } from './entity/despesas.entity';
import { DespesasDTO } from './dto/despesas.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { SuccessResponseData} from 'src/shared/dto/success-response-data.dto'
@Controller('despesas')
@ApiTags('despesas')
@UseGuards(JwtAuthGuard)
export class DespesasController {
  constructor(private readonly despesaService: DespesaService) {}

  @Get()
  @ApiQuery({ name: 'ano', required: false, example: new Date().getFullYear() })
  @ApiQuery({ name: 'mes', required: false, example: new Date().getMonth() })
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaTodasDespesas(
    @User() user: UserPayloadInterface,
    @Query('ano', ParseIntPipe) ano?: number,
    @Query('mes', ParseIntPipe) mes?: number,
    @Query('pago') pago?: boolean,
  ): Promise<SuccessResponseData<Despesas>> {
    let data = await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData<Despesas>(data);
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

    return new SuccessResponseData<number>(data)
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

    return new SuccessResponseData(data)
  }

  @Get('/:ano/mes/:mes')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaDespesasAnoMes(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaTodasDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(data)
  }

  @Get('/:ano/mes/:mes/categoria/valor')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaValorDespesasAgrupadosPorCategoria(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaValorDespesasAgrupadosPorCategoria(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(data)
  }

  @Get('/:ano/mes/:mes/carteira/valor')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async retornaValorDespesasAgrupadosPorCarteira(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {
    let data = await this.despesaService.retornaValorDespesasAgrupadosPorCarteira(
      ano,
      mes,
      pago,
      user.userId,
    );

    return new SuccessResponseData(data)
  }

  @Get('/:ano/mes/:mes/total')
  @ApiQuery({ name: 'pago', required: false, example: true })
  async getTotalDespesas(
    @User() user: UserPayloadInterface,
    @Param('ano') ano: number,
    @Param('mes') mes: number,
    @Query('pago') pago: boolean,
  ) {

    let data =  await this.despesaService.retornaTotalDespesas(
      ano,
      mes,
      pago,
      user.userId,
    );
    return new SuccessResponseData(data);
  }

  @Get('/id/:id')
  async getById(
    @User() userToken: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<SuccessResponseData<Despesas>> {
    let res = await this.despesaService.getOne(id, userToken.userId);
    const { user, ...data } = res
    return new SuccessResponseData<Despesas>(data);
  }

  @Patch('flag/:id')
  async alteraFlagPago(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() despesa,
  ):  Promise<SuccessResponseData<Despesas>> {

    let data = await this.despesaService.alteraFlagPago(id, despesa, user.userId);
    return new SuccessResponseData<Despesas>(data);
  }

  @Put('/:id')
  async alteraDespesa(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() despesa: DespesasDTO,
  ): Promise<SuccessResponseData<Despesas>> {
    let data =  await this.despesaService.alteraDespesa(id, despesa, user.userId);
    return new SuccessResponseData<Despesas>(data);
  }

  @Delete('/:id')
  async deletaDespesa(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<SuccessResponseData<{ deleted: boolean }>> {
    let data = await this.despesaService.deletaDespesa(id, user.userId);
    return new SuccessResponseData<{ deleted: boolean }>(data);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereDespesa(@Body() despesa: DespesasDTO): Promise<SuccessResponseData<Despesas>> {
    let data = await  this.despesaService.insereDespesa(despesa);
    return new SuccessResponseData<Despesas>(data);
  }
}
