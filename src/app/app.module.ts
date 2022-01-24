import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceitasModule } from '@receitas/receitas.module';
import { TransferenciasModule } from 'src/transferencias/transferencias.module';

import { AuthModule } from '@auth/auth.module';

import { CategoriasModule } from '@categorias/categorias.module';

import { WalletModule } from '@carteiras/wallet.module';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { DespesasModule } from '@despesas/despesas.module';

import { GraphicModule } from '@graphic/graphic.module';

import { AppController } from './app.controller';
import { AppService } from './service';

@Module({
  imports: [
    DespesasModule,
    ReceitasModule,
    CategoriasModule,
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
