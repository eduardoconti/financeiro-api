import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';

import { ReceitasModule } from '@earning/earning.module';

import { CategoryModule } from '@category/category.module';

import { WalletModule } from '@wallet/wallet.module';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@expense/expense.module';

import { GraphicModule } from '@graphic/graphic.module';

import { TransferenciasModule } from '@transference/transferencias.module';

import { AppController } from './app.controller';
import { AppService } from './service';
import { DatabaseModule } from '@db/database.module';

@Module({
  imports: [
    DespesasModule,
    ReceitasModule,
    CategoryModule,
    WalletModule,
    TransferenciasModule,
    UsersModule,
    AuthModule,
    GraphicModule,
    DatabaseModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        autoLoadEntities: true,
        synchronize: false,
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        //ssl: { rejectUnauthorized: false },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: TYPES.AppService, useClass: AppService }],
})
export class AppModule {}
