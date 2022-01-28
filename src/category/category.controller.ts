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
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from '@auth/interfaces/user-payload.interface';

import { User } from '@users/decorator/user.decorator';

import { TYPES } from '@config/dependency-injection';

import {
  CategoryDeleteResponseDTO,
  InsertCategoryRequestDTO,
  UpdateCategoryDTO,
} from './dto';
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

  @Get('/:id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<Categorias> {
    return await this.getCategoryService.findCategoryUserById(id, user.userId);
  }

  @Post()
  async insert(
    @Body() categoryRequest: InsertCategoryRequestDTO,
    @User() user: UserPayloadInterface,
  ): Promise<Categorias> {
    return this.insertCategoryService.insertCategory(
      categoryRequest,
      user.userId,
    );
  }

  @Delete('/:id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<CategoryDeleteResponseDTO> {
    return await this.deleteCategoryService.deleteCategory(id, user.userId);
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryRequest: UpdateCategoryDTO,
    @User() user: UserPayloadInterface,
  ): Promise<Categorias> {
    return this.updateCategoryService.update(id, user.userId, categoryRequest);
  }
}
