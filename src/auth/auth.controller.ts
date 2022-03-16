import {
  Controller,
  Post,
  UseGuards,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

import { SignDto, LoginRequestDTO } from '@auth/dto';
import { LocalAuthGuard } from '@auth/guard';
import { UserPayloadInterface } from '@auth/interfaces';
import { IAuthService } from '@auth/service';

import { User } from 'src/user/decorator';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { SUCCESS_MESSAGES } from './constants';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    @Inject(TYPES.AuthService)
    private readonly authService: IAuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'send credentials to return a JWT Token',
    description: 'Generate JWT token with 7days expiration',
  })
  @ApiBody({ type: LoginRequestDTO })
  async login(
    @User() user: UserPayloadInterface,
  ): Promise<SuccessResponseData<SignDto>> {
    return new SuccessResponseData<SignDto>(
      await this.authService.login(user),
      HttpStatus.CREATED,
      SUCCESS_MESSAGES.AUTHENTICATION_SUCCESS,
    );
  }
}
