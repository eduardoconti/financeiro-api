import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { CategoryController } from './category.controller';
import { Category } from './entity';
import { CategoryRepository } from './repository';
import {
  DeleteCategoryService,
  GetCategoryService,
  InsertCategoryService,
  UpdateCategoryService,
} from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UsersModule],
  controllers: [CategoryController],
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
  ],
  exports: [
    {
      provide: TYPES.GetCategoryService,
      useClass: GetCategoryService,
    },
  ],
})
export class CategoryModule {}
