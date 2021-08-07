import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  Delete,
} from '@nestjs/common';
import { UserDto } from './dto/users.dto';
import { UsersService } from './service/users.service';
import { ApiTags } from '@nestjs/swagger';
import { MasterUserGuard } from './guard/master-user.guard';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Users } from './entity/users.entity';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly userService: UsersService) {}
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
