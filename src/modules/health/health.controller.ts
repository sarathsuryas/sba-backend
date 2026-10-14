import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DatabaseService } from '../../database/database.service.js';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly db: DatabaseService) {}

  @Get()
  async check() {
    try {
      await this.db.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException('Database unreachable');
    }
    return { status: 'ok' };
  }
}
