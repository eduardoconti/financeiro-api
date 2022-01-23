import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Inject,
} from '@nestjs/common';

import { ApiTags } from '@nestjs/swagger';

import { TYPES } from '@config/dependency-injection';
import { JwtAuthGuard } from '@auth/guard';
import { IUserService } from './service';
import { MasterUserGuard } from './guard';
import { Users } from './entity';
import { UserDto } from './dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @Inject(TYPES.UserService)
    private readonly userService: IUserService) { }
  @Get()
  @UseGuards(MasterUserGuard)
  async returnAllUsers(): Promise<Users[]> {
    return await this.userService.returnAllUsers();
  }

  @Post()
  @UseGuards(MasterUserGuard)
  async createUser(@Body() user: UserDto): Promise<Users> {
    return await this.userService.createUser(user);
  }

  @UseGuards(MasterUserGuard)
  @Get('/login/:login')
  async returnUserByEmail(@Param('login') login: string): Promise<Users> {
    return await this.userService.returnUserByLogin(login);
  }

  @Delete('/:id')
  @UseGuards(MasterUserGuard)
  async deletUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    return this.userService.deletUser(id);
  }
}
