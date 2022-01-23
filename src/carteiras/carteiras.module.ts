import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { carteirasProviders } from './carteiras.providers';
import { CarteirasController } from './carteiras.controller';
import { CarteirasService } from './service/carteiras.service';
import { TYPES } from '@config/dependency-injection';
@Module({
  imports: [DatabaseModule],
  controllers: [CarteirasController],
  providers: [...carteirasProviders, {
    provide: TYPES.CarteiraService,
    useClass: CarteirasService
  }],
})
export class CarteirasModule { }
