import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, verifyPassword } from '../../common/utils/password.js';
import type { AppConfig } from '../../config/configuration.js';
import type { User } from '../users/users.types.js';
import { AuthRepository } from './auth.repository.js';
import type { JwtPayload } from './auth.types.js';
import type { AuthResponseDto } from './dto/auth-response.dto.js';
import type { ChangePasswordDto } from './dto/change-password.dto.js';
import type { LoginDto } from './dto/login.dto.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;
const INVALID_CREDENTIALS = 'Invalid email or password';

// Compared against when the email is unknown, so the response time doesn't
// reveal whether an account exists.
const DUMMY_HASH =
  '$2b$12$bU/LwtkNA4GMd46MSK67YenIGOneHDgStQ/jpIRaWiECHBHVbEBY6';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService<AppConfig, true>,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      await verifyPassword(dto.password, DUMMY_HASH);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      throw new UnauthorizedException(
        'Account is temporarily locked. Try again later.',
      );
    }

    const passwordOk = await verifyPassword(dto.password, user.passwordHash);
    if (!passwordOk) {
      await this.recordFailure(user.id, user.failedLoginAttempts);
      throw new UnauthorizedException(INVALID_CREDENTIALS);
    }

    if (user.status !== 'active') {
      throw new UnauthorizedException('Account is deactivated');
    }

    await this.authRepository.recordSuccessfulLogin(user.id);

    const payload: JwtPayload = { sub: user.id, roles: user.roles };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      tokenType: 'Bearer',
      expiresIn: this.config.get('jwt', { infer: true }).expiresIn,
      mustChangePassword: user.mustChangePassword,
    };
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const currentOk = await verifyPassword(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!currentOk) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must differ from the current one',
      );
    }

    await this.authRepository.updatePassword(
      userId,
      await hashPassword(dto.newPassword),
    );
  }

  async me(userId: string): Promise<User> {
    const user = await this.authRepository.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  /** Counts a failed attempt; locks the account and resets the count at the limit. */
  private async recordFailure(userId: string, previousAttempts: number) {
    const attempts = previousAttempts + 1;
    if (attempts >= MAX_FAILED_ATTEMPTS) {
      await this.authRepository.recordFailedLogin(
        userId,
        0,
        new Date(Date.now() + LOCK_DURATION_MS),
      );
    } else {
      await this.authRepository.recordFailedLogin(userId, attempts, null);
    }
  }
}
