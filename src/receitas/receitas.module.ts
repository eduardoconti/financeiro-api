import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '../db/database.module';
import { Receitas } from './entity';
import { ReceitasController } from './receitas.controller';
import { EarningRepository } from './repository';
import {
  DeleteEarningService,
  GetEarningService,
  InsertEarningService,
  UpdateEarningService,
} from './service';

@Module({
  imports: [DatabaseModule, UsersModule, TypeOrmModule.forFeature([Receitas])],
  controllers: [ReceitasController],
  providers: [
    { provide: TYPES.InsertEarningService, useClass: InsertEarningService },
    { provide: TYPES.UpdateEarningService, useClass: UpdateEarningService },
    { provide: TYPES.DeleteEarningService, useClass: DeleteEarningService },
    { provide: TYPES.GetEarningService, useClass: GetEarningService },
    { provide: TYPES.EarningRepository, useClass: EarningRepository },
  ],
  exports: [{ provide: TYPES.GetEarningService, useClass: GetEarningService }],
})
export class ReceitasModule {}
