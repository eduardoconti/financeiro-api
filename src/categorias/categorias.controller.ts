import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Put,
  UseGuards,
  Inject,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { User } from 'src/shared/decorator/user.decorator';
import { UserLoggedGuard } from 'src/users/guard/user-logged-auth.guard';

import { TYPES } from '@config/dependency-injection';

import { CategoriaDeleteResponseDTO } from './dto';
import { CategoriasDTO } from './dto/categorias.dto';
import { Categorias } from './entity/categorias.entity';
import { CategoriasService } from './service';
import { ICategoriaService } from './service/categoria.service.interface';

@Controller('categorias')
@ApiTags('categorias')
@UseGuards(JwtAuthGuard)
export class CategoriasController {
  constructor(
    @Inject(TYPES.CategoriaService)
    private readonly categoriaService: CategoriasService,
  ) {}

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
  @UseGuards(UserLoggedGuard)
  async deletaCategoria(
    @Param('id') id: number,
  ): Promise<CategoriaDeleteResponseDTO> {
    return this.categoriaService.deletaCategoria(id);
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async alteraDespesa(
    @Param('id') id: number,
    @Body() despesa: CategoriasDTO,
  ): Promise<Categorias> {
    return this.categoriaService.alteraCategoria(id, despesa);
  }
}
