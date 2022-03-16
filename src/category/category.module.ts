import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/user/users.module';

import { TYPES } from '@config/dependency-injection';

import { CategoryController } from './category.controller';
import { Categorias } from './entity';
import { CategoryRepository } from './repository';
import {
  DeleteCategoryService,
  GetCategoryService,
  InsertCategoryService,
  UpdateCategoryService,
} from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Categorias]), UsersModule],
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
})
export class CategoryModule {}
