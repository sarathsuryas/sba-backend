import { ApiProperty } from '@nestjs/swagger';

/** Shape of every error body produced by AllExceptionsFilter. */
export class ErrorResponseDto {
  /** @example 400 */
  statusCode: number;

  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: ['email must be an email'],
  })
  message: string | string[];

  /** @example /api/users */
  path: string;

  /** @example 2026-10-15T10:00:00.000Z */
  timestamp: string;
}
