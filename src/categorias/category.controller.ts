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

import { CategoryDeleteResponseDTO, CategoryDTO } from './dto';
import { Categorias } from './entity/categorias.entity';
import {
  IDeleteCategoryService,
  IGetCategoryService,
  IInsertCategoryService,
  IUpdateCategoryService,
} from './service';

@Controller('categorias')
@ApiTags('Category')
@UseGuards(JwtAuthGuard)
export class CategoryController {
  constructor(
    @Inject(TYPES.GetCategoryService)
    private readonly getCategoryService: IGetCategoryService,
    @Inject(TYPES.InsertCategoryService)
    private readonly insertCategoryService: IInsertCategoryService,
    @Inject(TYPES.UpdateCategoryService)
    private readonly updateCategoryService: IUpdateCategoryService,
    @Inject(TYPES.DeleteCategoryService)
    private readonly deleteCategoryService: IDeleteCategoryService,
  ) {}

  @Get()
  async getAll(@User() user: UserPayloadInterface): Promise<Categorias[]> {
    return await this.getCategoryService.getAllCategories(user.userId);
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async insert(@Body() categoryRequest: CategoryDTO): Promise<Categorias> {
    return this.insertCategoryService.insertCategory(categoryRequest);
  }

  @Delete('/:id')
  @UseGuards(UserLoggedGuard)
  async delete(@Param('id') id: number): Promise<CategoryDeleteResponseDTO> {
    return this.deleteCategoryService.deleteCategory(id);
  }

  @Put('/:id')
  @UseGuards(UserLoggedGuard)
  async update(
    @Param('id') id: number,
    @Body() categoryRequest: CategoryDTO,
  ): Promise<Categorias> {
    return this.updateCategoryService.update(id, categoryRequest);
  }
}
