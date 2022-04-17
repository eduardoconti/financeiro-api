import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@users/users.module';

import { TYPES } from '@config/dependency-injection';

import { AuthController } from './auth.controller';
import { AuthService } from './service';
import { JwtStrategy, LocalStrategy } from './strategy';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_JWT'),
        signOptions: { expiresIn: '1y' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: TYPES.AuthService,
      useClass: AuthService,
    },
    LocalStrategy,
    JwtStrategy,
  ],
  exports: [
    {
      provide: TYPES.AuthService,
      useClass: AuthService,
    },
    JwtModule,
  ],
})
export class AuthModule {}
