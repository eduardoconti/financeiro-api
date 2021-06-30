import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AppService } from './app.service';
import { Home } from './dto/home.dto';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/shared/decorator/user.decorator';
import { SignDto } from 'src/auth/dto/sign-in.dto';
import { UserPayloadInterface } from 'src/auth/interfaces/user-payload.interface';
import { LocalAuthGuard } from 'src/auth/guard/local-auth.guard';
import { AuthService } from 'src/auth/service/auth.service';

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

  @Get('calc')
  getCalc() {
    var exec = require('child_process').exec;
    exec('calc');
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@User() user: UserPayloadInterface): Promise<SignDto> {
    return this.authService.login(user);
  }

  @Get('uuid')
  getUuid(): string {
    return uuidv4();
  }
}
