
import { Module } from '@nestjs/common';
import { DespesasModule } from '@despesas/despesas.module';
import { ReceitasModule } from '@receitas/receitas.module';
import { CategoriasModule } from '@categorias/categorias.module';
import { CarteirasModule } from '@carteiras/carteiras.module';
import { TransferenciasModule } from 'src/transferencias/transferencias.module';
import { AuthModule } from '@auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './service';
import { UsersModule } from '@users/users.module';
import { GraphicModule } from '@graphic/graphic.module';
import { TYPES } from '@config/dependency-injection';


@Module({
  imports: [
    DespesasModule,
    ReceitasModule,
    CategoriasModule,
    CarteirasModule,
    TransferenciasModule,
    UsersModule,
    AuthModule,
    GraphicModule,
    ConfigModule.forRoot({
      envFilePath: [`.env`],
    }),
  ],
  controllers: [AppController],
  providers: [{ provide: TYPES.AppService, useClass: AppService }],
})
export class AppModule { }
