import { Module } from '@nestjs/common';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { CarteirasController } from './carteiras.controller';
import { carteirasProviders } from './carteiras.providers';
import { CarteirasService } from './service/carteiras.service';
@Module({
  imports: [DatabaseModule],
  controllers: [CarteirasController],
  providers: [
    ...carteirasProviders,
    {
      provide: TYPES.CarteiraService,
      useClass: CarteirasService,
    },
  ],
})
export class CarteirasModule {}
