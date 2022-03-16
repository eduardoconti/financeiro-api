import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from 'src/user/users.module';

import { TYPES } from '@config/dependency-injection';

import { Carteiras } from './entity';
import { WalletRepository } from './repository';
import {
  DeleteWalletService,
  GetWalletService,
  InsertWalletService,
  UpdateWalletService,
} from './service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Carteiras]), UsersModule],
  controllers: [WalletController],
  providers: [
    {
      provide: TYPES.WalletRepository,
      useClass: WalletRepository,
    },
    {
      provide: TYPES.CarteiraService,
      useClass: GetWalletService,
    },
    {
      provide: TYPES.UpdateWalletService,
      useClass: UpdateWalletService,
    },
    {
      provide: TYPES.InsertWalletService,
      useClass: InsertWalletService,
    },
    {
      provide: TYPES.DeleteWalletService,
      useClass: DeleteWalletService,
    },
  ],
})
export class WalletModule {}
