import { Inject, Injectable, NotImplementedException } from '@nestjs/common';
import type { Pool } from 'pg';
import { PG_POOL } from '../../database/database.constants.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { User } from './users.types.js';

@Injectable()
export class UsersRepository {
  constructor(@Inject(PG_POOL) private readonly pool: Pool) {}

  findAll(limit: number, offset: number): Promise<User[]> {
    throw new NotImplementedException();
  }

  findById(id: string): Promise<User | null> {
    throw new NotImplementedException();
  }

  create(data: CreateUserDto): Promise<User> {
    throw new NotImplementedException();
  }

  update(id: string, data: UpdateUserDto): Promise<User | null> {
    throw new NotImplementedException();
  }

  delete(id: string): Promise<boolean> {
    throw new NotImplementedException();
  }
}
