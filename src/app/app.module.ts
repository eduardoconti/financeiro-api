import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';

import { ReceitasModule } from '@receitas/receitas.module';

import { CategoryModule } from '@category/category.module';

import { WalletModule } from '@wallet/wallet.module';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@despesas/despesas.module';

import { GraphicModule } from '@graphic/graphic.module';

import { TransferenciasModule } from '@transference/transferencias.module';

import { AppController } from './app.controller';
import { AppService } from './service';

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
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        ssl: { rejectUnauthorized: false },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: TYPES.AppService, useClass: AppService }],
})
export class AppModule {}
