import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@users/user.module';

import { TYPES } from '@config/dependency-injection';

import { CategoryController } from './category.controller';
import { Category, SubCategory } from './entity';
import { CategoryRepository } from './repository';
import { SubCategoryRepository } from './repository/sub-category';
import {
  DeleteCategoryService,
  GetCategoryService,
  InsertCategoryService,
  UpdateCategoryService,
} from './service';
import {
  DeleteSubCategoryService,
  GetSubCategoryService,
  InsertSubCategoryService,
  UpdateSubCategoryService,
} from './service/sub-category';
import { SubCategoryController } from './sub-category.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, SubCategory]), UserModule],
  controllers: [CategoryController, SubCategoryController],
  providers: [
    {
      provide: TYPES.CategoryRepository,
      useClass: CategoryRepository,
    },
    {
      provide: TYPES.GetCategoryService,
      useClass: GetCategoryService,
    },
    {
      provide: TYPES.InsertCategoryService,
      useClass: InsertCategoryService,
    },
    {
      provide: TYPES.UpdateCategoryService,
      useClass: UpdateCategoryService,
    },
    {
      provide: TYPES.DeleteCategoryService,
      useClass: DeleteCategoryService,
    },
    {
      provide: TYPES.SubCategoryRepository,
      useClass: SubCategoryRepository,
    },
    {
      provide: TYPES.GetSubCategoryService,
      useClass: GetSubCategoryService,
    },
    {
      provide: TYPES.InsertSubCategoryService,
      useClass: InsertSubCategoryService,
    },
    {
      provide: TYPES.UpdateSubCategoryService,
      useClass: UpdateSubCategoryService,
    },
    {
      provide: TYPES.DeleteSubCategoryService,
      useClass: DeleteSubCategoryService,
    },
  ],
  exports: [
    {
      provide: TYPES.GetCategoryService,
      useClass: GetCategoryService,
    },
    {
      provide: TYPES.GetSubCategoryService,
      useClass: GetSubCategoryService,
    },
    {
      provide: TYPES.CategoryRepository,
      useClass: CategoryRepository,
    },
    {
      provide: TYPES.SubCategoryRepository,
      useClass: SubCategoryRepository,
    },
  ],
})
export class CategoryModule {}
