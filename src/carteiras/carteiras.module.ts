import { Module } from '@nestjs/common';
import { DatabaseModule } from '../db/database.module';
import { categoriasProviders } from './carteiras.providers';
import { CarteirasController } from './carteiras.controller';
import { CarteirasService } from './service/carteiras.service';
@Module({
  imports: [DatabaseModule],
  controllers: [CarteirasController],
  providers: [...categoriasProviders, CarteirasService],
})
export class CarteirasModule {}
