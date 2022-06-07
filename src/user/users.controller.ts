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
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

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

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(
    @Inject(TYPES.GetUserService)
    private readonly getUserService: IGetUserService,
    @Inject(TYPES.InsertUserService)
    private readonly insertUserService: IInsertUserService,
    @Inject(TYPES.DeleteUserService)
    private readonly deleteUserService: IDeleteUserService,
  ) {}

  @ApiOperation({
    summary: 'Gel all users.',
    description:
      'Return all users. This endpoint is authorized for admin user.',
  })
  @UseGuards(MasterUserGuard)
  @Get()
  async getAllUsers(): Promise<Users[]> {
    return await this.getUserService.getAll();
  }

  @Post()
  @ApiOperation({
    summary: 'Insert user.',
    description: 'Create an user. This endpoint is authorized for admin user.',
  })
  //@UseGuards(MasterUserGuard)
  async createUser(@Body() user: UserDTO): Promise<Users> {
    return await this.insertUserService.insert(user);
  }

  @ApiOperation({
    summary: 'Get user by login.',
    description:
      'Return user by login. This endpoint is authorized for admin user.',
  })
  @UseGuards(MasterUserGuard)
  @Get('login/:login')
  async getUserByLogin(@Param('login') login: string): Promise<Users> {
    return await this.getUserService.getUserByLogin(login);
  }

  @ApiOperation({
    summary: 'Delete user by id.',
    description:
      'Remove user by id. This endpoint is authorized for admin user.',
  })
  @UseGuards(MasterUserGuard)
  @Delete('/:id')
  async deleteUser(@Param('id') id: string): Promise<UserDeleteResponseDTO> {
    return await this.deleteUserService.delete(id);
  }
}
