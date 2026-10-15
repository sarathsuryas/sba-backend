import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import {
  ApiAuth,
  ApiErrors,
} from '../../common/swagger/api-errors.decorator.js';
import { UserResponseDto } from '../users/dto/user-response.dto.js';
import { AuthService } from './auth.service.js';
import type { JwtPayload } from './auth.types.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { AuthResponseDto } from './dto/auth-response.dto.js';
import { ChangePasswordDto } from './dto/change-password.dto.js';
import { LoginDto } from './dto/login.dto.js';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Log in',
    description:
      'Public. Returns an access token. Locks the account for 15 minutes after 5 failed attempts. ' +
      'If `mustChangePassword` is true, the client should prompt for a new password.',
  })
  @ApiErrors('badRequest')
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials, account locked, or account deactivated',
    type: ErrorResponseDto,
  })
  login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Post('change-password')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Change own password',
    description:
      'Requires the current password. Clears the must-change-password flag.',
  })
  @ApiAuth()
  @ApiErrors('badRequest')
  @ApiNoContentResponse({ description: 'Password changed' })
  changePassword(
    @CurrentUser() user: JwtPayload,
    @Body() dto: ChangePasswordDto,
  ): Promise<void> {
    return this.authService.changePassword(user.sub, dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiAuth()
  @ApiErrors('notFound')
  async me(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    return UserResponseDto.from(await this.authService.me(user.sub));
  }
}
