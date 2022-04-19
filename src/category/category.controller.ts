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
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from '@auth/interfaces/user-payload.interface';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';
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
  ): Promise<SuccessResponseData<Category>> {
    const data = await this.getCategoryService.findCategoryUserById(
      id,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @ApiOperation({
    summary: 'Insert category.',
    description: 'Create an category for use in expense.',
  })
  @Post()
  async insert(
    @Body() categoryRequest: InsertCategoryRequestDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<Category>> {
    const data = await this.insertCategoryService.insertCategory(
      categoryRequest,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.CATEGORY_CREATE_SUCCESS,
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
  ): Promise<SuccessResponseData<CategoryDeleteResponseDTO>> {
    const data = await this.deleteCategoryService.deleteCategory(
      id,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.CATEGORY_DELETE_SUCCESS,
    );
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
  ): Promise<SuccessResponseData<Category>> {
    const data = await this.updateCategoryService.update(
      id,
      user.userId,
      categoryRequest,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.CATEGORY_UPDATE_SUCCESS,
    );
  }
}
