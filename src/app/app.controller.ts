import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  HttpStatus
} from '@nestjs/common';

import { AppService } from './app.service';
import { Home } from './dto/home.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/shared/decorator/user.decorator';
import { SignDto } from 'src/auth/dto/sign-in.dto';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { AuthService } from 'src/auth/service/auth.service';
import * as bcrypt from 'bcrypt';
import { SuccessResponseData } from 'src/shared/dto/success-response-data.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Get()
  getHello(): Home {
    return this.appService.getHello();
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@User() user: UserPayloadInterface): Promise<SuccessResponseData<SignDto>> {
    return new SuccessResponseData( await this.authService.login(user), HttpStatus.OK, "Usuário autenticado!");
  }

  @Get('uuid')
  getUuid(): string {
    return uuidv4();
  }

  @Get('hash/:senha')
  async hash(
    @Param('senha') senha:string
  ): Promise<string> {
    return await bcrypt.hash(senha, 15);
  }
}
