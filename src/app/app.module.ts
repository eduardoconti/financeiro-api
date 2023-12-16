import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '@auth/auth.module';

import { ReceitasModule } from '@earning/earning.module';

import { CategoryModule } from '@category/category.module';

import { WalletModule } from '@wallet/wallet.module';

import { UserModule } from '@users/user.module';

import { TYPES } from '@config/dependency-injection';

import { DatabaseModule } from '@db/database.module';

import { DespesasModule } from '@expense/expense.module';

import { GraphicModule } from '@graphic/graphic.module';

import { TransferenceModule } from '@transference/transference.module';

import { DashBoardModule } from '@dashboard/dashboard.module';

import { AppController } from './app.controller';
import { AppService } from './service';

@Module({
  imports: [
    DespesasModule,
    ReceitasModule,
    CategoryModule,
    WalletModule,
    TransferenceModule,
    UserModule,
    AuthModule,
    GraphicModule,
    DatabaseModule,
    DashBoardModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const config: any = {
          type: 'postgres',
          autoLoadEntities: true,
          synchronize: configService.get('DATABASE_SYNCHRONIZE') ?? false,
          host: configService.get('POSTGRES_HOST'),
          port: configService.get('POSTGRES_PORT'),
          username: configService.get('POSTGRES_USER'),
          password: configService.get('POSTGRES_PASSWORD'),
          database: configService.get('POSTGRES_DB'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          logging:  configService.get('DATABASE_LOGGING') ?? false,
        }

        if(configService.get('NODE_ENV') === 'production'){
          config.ssl = { rejectUnauthorized: false }
        }
        return config},
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: TYPES.AppService, useClass: AppService }],
})
export class AppModule {}
