import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination.dto.js';
import { ParseIdPipe } from '../../common/pipes/parse-id.pipe.js';
import type { JwtPayload } from '../auth/auth.types.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserResponseDto } from './dto/user-response.dto.js';
import { UsersService } from './users.service.js';

@ApiTags('users')
@ApiBearerAuth()
@Roles('admin', 'staff')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll(query);
    return users.map((user) => UserResponseDto.from(user));
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIdPipe) id: string,
  ): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.usersService.findOne(id));
  }

  @Post()
  async create(
    @Body() dto: CreateUserDto,
    @CurrentUser() actor: JwtPayload,
  ): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.usersService.create(dto, actor));
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIdPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.usersService.update(id, dto));
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(
    @Param('id', ParseIdPipe) id: string,
    @CurrentUser() actor: JwtPayload,
  ): Promise<void> {
    await this.usersService.remove(id, actor);
  }
}
