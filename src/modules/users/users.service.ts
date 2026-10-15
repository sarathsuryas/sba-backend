import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { PaginationQueryDto } from '../../common/dto/pagination.dto.js';
import { hashPassword } from '../../common/utils/password.js';
import type { JwtPayload } from '../auth/auth.types.js';
import type { CreateUserDto } from './dto/create-user.dto.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersRepository } from './users.repository.js';
import type { User, UserChanges } from './users.types.js';

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

  async create(dto: CreateUserDto, actor: JwtPayload): Promise<User> {
    // Staff can only open customer accounts; staff/admin accounts need an admin.
    if (dto.role !== 'customer' && !actor.roles.includes('admin')) {
      throw new ForbiddenException(`Only admins can create ${dto.role} users`);
    }

    return this.usersRepository.create({
      email: dto.email.toLowerCase(),
      passwordHash: await hashPassword(dto.password),
      customerId: dto.customerId ?? null,
      createdBy: actor.sub,
      role: dto.role,
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const changes: UserChanges = {};
    if (dto.email !== undefined) changes.email = dto.email.toLowerCase();
    if (dto.customerId !== undefined) changes.customerId = dto.customerId;
    if (dto.status !== undefined) changes.status = dto.status;

    const user = await this.usersRepository.update(id, changes);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  async remove(id: string, actor: JwtPayload): Promise<void> {
    if (id === actor.sub) {
      throw new ForbiddenException('You cannot delete your own account');
    }
    const deleted = await this.usersRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`User ${id} not found`);
    }
  }
}
