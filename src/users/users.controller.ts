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

import { JwtAuthGuard } from '@auth/guard';

import { TYPES } from '@config/dependency-injection';

import { UserDeleteResponseDTO, UserDTO } from './dto';
import { Users } from './entity';
import { MasterUserGuard } from './guard';
import {
  IDeleteUserService,
  IGetUserService,
  IInsertUserService,
} from './service';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    @Inject(TYPES.GetUserService)
    private readonly getUserService: IGetUserService,
    @Inject(TYPES.InsertUserService)
    private readonly insertserService: IInsertUserService,
    @Inject(TYPES.DeleteUserService)
    private readonly deleteUserService: IDeleteUserService,
  ) {}
  @Get()
  async getAllUsers(): Promise<Users[]> {
    return await this.getUserService.getAll();
  }

  @Post()
  @UseGuards(MasterUserGuard)
  async createUser(@Body() user: UserDTO): Promise<Users> {
    return await this.insertserService.insert(user);
  }

  @Get('login/:login')
  async getUserByLogin(@Param('login') login: string): Promise<Users> {
    return await this.getUserService.getUserByLogin(login);
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<UserDeleteResponseDTO> {
    return await this.deleteUserService.delete(id);
  }
}
