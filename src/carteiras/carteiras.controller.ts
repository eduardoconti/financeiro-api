import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Carteiras } from './entity/carteiras.entity';
import { CarteirasDTO } from './dto/carteiras.dto';
import { ApiTags } from '@nestjs/swagger';
import { CarteirasService } from './service/carteiras.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { User } from 'src/shared/decorator/user.decorator';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';
@Controller('carteiras')
@ApiTags('carteiras')
@UseGuards(JwtAuthGuard)
export class CarteirasController {
  constructor(private readonly carteiraService: CarteirasService) {}

  @Get()
  async getAll(@User() user: UserPayloadInterface): Promise<Carteiras[]> {
    return await this.carteiraService.retornaTodasCarteiras(user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereCarteira(@Body() despesa: CarteirasDTO): Promise<Carteiras> {
    return this.carteiraService.insereCarteira(despesa);
  }

  @Delete('/:id')
  async deletaCarteira(
    @User() user: UserPayloadInterface,
    @Param('id') id: number): Promise<{ deleted: boolean }> {
    return this.carteiraService.deletaCarteira(id, user.userId);
  }

  @Put('/:id')
  async alteraDespesa(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() despesa: CarteirasDTO,
  ): Promise<Carteiras> {
    return this.carteiraService.alteraCarteira(id, despesa, user.userId);
  }
}
