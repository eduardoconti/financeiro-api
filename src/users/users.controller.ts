import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersService } from './service/users.service';
import { ApiTags } from '@nestjs/swagger';
import { UserLoggedGuard } from './guard/user-logged-auth.guard';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
//@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
  @Get()
  @UseGuards(UserLoggedGuard)
  async returnAllUsers() {
    return await this.userService.returnAllUsers();
  }

  @Post()
  @UseGuards(UserLoggedGuard)
  async createUser(@Body() user: UserDto) {
    return await this.userService.createUser(user);
  }

  @Get('/login/:login')
  async returnUserByEmail(@Param('login') login: string) {
    return await this.userService.returnUserByLogin(login);
  }
}
