import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Delete,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

import { TYPES } from '@config/dependency-injection';

import { SuccessResponseData } from '@shared/dto';

import { UserDeleteResponseDTO, UserDTO } from './dto';
import { Users } from './entity';
import { MasterUserGuard } from './guard';
import {
  IDeleteUserService,
  IGetUserService,
  IInsertUserService,
} from './service';
import { JwtAuthGuard } from '@auth/guard';

@ApiTags('Users')
@Controller('users')
@ApiBearerAuth()
export class UserController {
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
  @Get()
  @UseGuards(JwtAuthGuard, MasterUserGuard)
  async getAllUsers(): Promise<SuccessResponseData<Users[]>> {
    const data = await this.getUserService.getAll();
    return new SuccessResponseData(data, HttpStatus.OK);
  }

  @Post()
  @ApiOperation({
    summary: 'Insert user.',
    description: 'Create an user. This endpoint is authorized for admin user.',
  })
  async createUser(@Body() user: UserDTO): Promise<SuccessResponseData<Users>> {
    const data = await this.insertUserService.insert(user);
    return new SuccessResponseData(data, HttpStatus.CREATED);
  }

  @ApiOperation({
    summary: 'Delete user by id.',
    description:
      'Remove user by id. This endpoint is authorized for admin user.',
  })
  @UseGuards(JwtAuthGuard, MasterUserGuard)
  @Delete(':id')
  async deleteUser(
    @Param('id') id: string,
  ): Promise<SuccessResponseData<UserDeleteResponseDTO>> {
    const data = await this.deleteUserService.delete(id);
    return new SuccessResponseData(data, HttpStatus.OK);
  }
}
