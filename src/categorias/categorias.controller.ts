import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Categorias } from './entity/categorias.entity';
import { CategoriasDTO } from './dto/categorias.dto';
import { ApiTags } from '@nestjs/swagger';
import { CategoriasService } from './service/categorias.service';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { User } from 'src/shared/decorator/user.decorator';
@Controller('categorias')
@ApiTags('categorias')
@UseGuards(JwtAuthGuard)
export class CategoriasController {
  constructor(private readonly categoriaService: CategoriasService) {}

  @Get()
  async getAll(@User() user: UserPayloadInterface): Promise<Categorias[]> {
    return await this.categoriaService.retornaTodasCategorias(user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insereCategoria(@Body() despesa: CategoriasDTO): Promise<Categorias> {
    return this.categoriaService.insereCategoria(despesa);
  }

  @Delete('/:id')
  async deletaCategoria(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    return this.categoriaService.deletaCategoria(id, user.userId);
  }

  @Put('/:id')
  async alteraDespesa(
    @User() user: UserPayloadInterface,
    @Param('id') id: number,
    @Body() despesa: CategoriasDTO,
  ): Promise<Categorias> {
    return this.categoriaService.alteraCategoria(id, despesa, user.userId);
  }
}
