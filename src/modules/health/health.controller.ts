import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import {
  ApiOperation,
  ApiServiceUnavailableResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../common/dto/error-response.dto.js';
import { DatabaseService } from '../../database/database.service.js';
import { Public } from '../auth/decorators/public.decorator.js';
import { HealthResponseDto } from './dto/health-response.dto.js';

@Public()
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  @ApiOperation({
    summary: 'Health check',
    description:
      'Public. Verifies the API is up and the database is reachable.',
  })
  @ApiServiceUnavailableResponse({
    description: 'Database unreachable',
    type: ErrorResponseDto,
  })
  async check(): Promise<HealthResponseDto> {
    try {
      await this.db.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException('Database unreachable');
    }
    return { status: 'ok' };
  }
}
