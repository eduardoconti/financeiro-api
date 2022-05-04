import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TYPES } from '@config/dependency-injection';

import { ReceitasController } from './earning.controller';
import { Earning } from './entity';
import { EarningRepository } from './repository';
import {
  DeleteEarningService,
  GetEarningService,
  InsertEarningService,
  UpdateEarningService,
} from './service';

@Module({
  imports: [TypeOrmModule.forFeature([Earning])],
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
