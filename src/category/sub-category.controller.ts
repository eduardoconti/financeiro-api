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
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '@auth/guard/jwt-auth.guard';
import { UserPayloadInterface } from '@auth/interfaces/user-payload.interface';

import { User } from '@users/decorator';

import { TYPES } from '@config/dependency-injection';

import {
  SwaggerApiInternalServerErrorResponse,
  SwaggerApiSuccessArrayResponse,
  SwaggerApiSuccessResponse,
} from '@shared/decorators/swagger';
import { SuccessResponseData } from '@shared/dto';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';
import {
  InsertSubCategoryRequestDTO,
  SubCategoryDeleteResponseDTO,
  SubCategoryResponseDTO,
  UpdateSubCategoryDTO,
} from './dto/sub-category';
import { SubCategory } from './entity';
import {
  IDeleteSubCategoryService,
  IGetSubCategoryService,
  IInsertSubCategoryService,
  IUpdateSubCategoryService,
} from './service/sub-category';

@Controller('subcategory')
@ApiTags('Sub Categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiExtraModels(SubCategoryResponseDTO)
export class SubCategoryController {
  constructor(
    @Inject(TYPES.GetSubCategoryService)
    private readonly getSubCategoryService: IGetSubCategoryService,
    @Inject(TYPES.InsertSubCategoryService)
    private readonly insertSubCategoryService: IInsertSubCategoryService,
    @Inject(TYPES.UpdateSubCategoryService)
    private readonly updateSubCategoryService: IUpdateSubCategoryService,
    @Inject(TYPES.DeleteSubCategoryService)
    private readonly deleteSubCategoryService: IDeleteSubCategoryService,
  ) {}

  @ApiOperation({
    summary: 'Gel all sub categories.',
    description: 'Return all sub categories by id from logged user.',
  })
  @Get()
  @SwaggerApiSuccessArrayResponse(
    SUCCESS_MESSAGES.GET_SUCCESS,
    SubCategoryResponseDTO,
  )
  @SwaggerApiInternalServerErrorResponse(
    ERROR_MESSAGES.SUB_CATEGORY_FIND_ERROR,
    'Database error',
  )
  async getAll(
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SubCategory[]>> {
    const { userId } = user;
    const data = await this.getSubCategoryService.getAllSubCategories({
      userId,
    });
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.GET_SUCCESS,
    );
  }

  @ApiOperation({
    summary: 'Get sub category by id.',
    description: 'Return sub categories by id and logged user id.',
  })
  @Get(':id')
  @SwaggerApiSuccessResponse(
    SUCCESS_MESSAGES.GET_SUCCESS,
    SubCategoryResponseDTO,
  )
  @SwaggerApiInternalServerErrorResponse(
    ERROR_MESSAGES.SUB_CATEGORY_FIND_ERROR,
    'Database error',
  )
  async getOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SubCategory>> {
    const data = await this.getSubCategoryService.findSubCategoryUserById(
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
    summary: 'Insert sub category.',
    description: 'Create an sub category for use in expense.',
  })
  @Post()
  @SwaggerApiSuccessResponse(
    SUCCESS_MESSAGES.SUB_CATEGORY_CREATE_SUCCESS,
    SubCategoryResponseDTO,
  )
  @SwaggerApiInternalServerErrorResponse(
    ERROR_MESSAGES.SUB_CATEGORY_CREATE_ERROR,
    'Failing row contains (37, 867dfc6e-1df0-4e3e-875e-15d1c579a5ff, null)',
  )
  async insert(
    @Body() categoryRequest: InsertSubCategoryRequestDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SubCategory>> {
    const data = await this.insertSubCategoryService.insertSubCategory(
      categoryRequest,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.SUB_CATEGORY_CREATE_SUCCESS,
    );
  }

  @ApiOperation({
    summary: 'Delete sub category.',
    description: 'Remove sub category by id.',
  })
  @Delete(':id')
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SubCategoryDeleteResponseDTO>> {
    const data = await this.deleteSubCategoryService.deleteSubCategory(
      id,
      user.userId,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.SUB_CATEGORY_DELETE_SUCCESS,
    );
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update sub category.',
    description: 'Update sub category by id.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() categoryRequest: UpdateSubCategoryDTO,
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SubCategory>> {
    const data = await this.updateSubCategoryService.update(
      id,
      user.userId,
      categoryRequest,
    );
    return new SuccessResponseData(
      data,
      HttpStatus.OK,
      SUCCESS_MESSAGES.SUB_CATEGORY_UPDATE_SUCCESS,
    );
  }
}
