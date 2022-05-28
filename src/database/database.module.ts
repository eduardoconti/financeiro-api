import { Module } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DatabaseService } from './services';

@Module({
  imports: [],
  providers: [
    {
      provide: TYPES.DatabaseService,
      useClass: DatabaseService,
    },
  ],
  exports: [
    {
      provide: TYPES.DatabaseService,
      useClass: DatabaseService,
    },
  ],
})
export class DatabaseModule {}
