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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from '@auth/interfaces/user-payload.interface';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import {
  CategoryDeleteResponseDTO,
  InsertCategoryRequestDTO,
  UpdateCategoryDTO,
} from './dto';
import { Category } from './entity/categorias.entity';
import {
  IDeleteCategoryService,
  IGetCategoryService,
  IInsertCategoryService,
  IUpdateCategoryService,
} from './service';

@Controller('category')
@ApiTags('Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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

  @ApiOperation({
    summary: 'Gel all categories.',
    description: 'Return all categories by id from logged user.',
  })
  @Get()
  async getAll(@User() user: UserPayloadInterface): Promise<Category[]> {
    return await this.getCategoryService.getAllCategories(user.userId);
  }

  @ApiOperation({
    summary: 'Get category by id.',
    description: 'Return categories by id and logged user id.',
  })
  @Get(':id')
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<Category> {
    return await this.getCategoryService.findCategoryUserById(id, user.userId);
  }

  @ApiOperation({
    summary: 'Insert category.',
    description: 'Create an category for use in expense.',
  })
  @Post()
  async insert(
    @Body() categoryRequest: InsertCategoryRequestDTO,
    @User() user: UserPayloadInterface,
  ): Promise<Category> {
    return this.insertCategoryService.insertCategory(
      categoryRequest,
      user.userId,
    );
  }

  @ApiOperation({
    summary: 'Delete category.',
    description: 'Remove category by id.',
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<CategoryDeleteResponseDTO> {
    return await this.deleteCategoryService.deleteCategory(id, user.userId);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update category.',
    description: 'Update category by id.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryRequest: UpdateCategoryDTO,
    @User() user: UserPayloadInterface,
  ): Promise<Category> {
    return this.updateCategoryService.update(id, user.userId, categoryRequest);
  }
}
