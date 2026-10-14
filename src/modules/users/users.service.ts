import { Injectable, NotFoundException } from '@nestjs/common';
import type { PaginationQueryDto } from '../../common/dto/pagination.dto.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersRepository } from './users.repository.js';
import type { User } from './users.types.js';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll({ limit, offset }: PaginationQueryDto): Promise<User[]> {
    return this.usersRepository.findAll(limit, offset);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  create(dto: CreateUserDto): Promise<User> {
    return this.usersRepository.create(dto);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.update(id, dto);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
