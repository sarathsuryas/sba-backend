import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { DatabaseError } from 'pg';

// Postgres error codes we translate into client errors.
const PG_ERROR_STATUS: Record<string, HttpStatus> = {
  '23505': HttpStatus.CONFLICT, // unique_violation
  '23503': HttpStatus.BAD_REQUEST, // foreign_key_violation
  '23502': HttpStatus.BAD_REQUEST, // not_null_violation
  '22P02': HttpStatus.BAD_REQUEST, // invalid_text_representation
};

/** Gives every error response the same shape. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const body = exception.getResponse();
      message =
        typeof body === 'string'
          ? body
          : ((body as { message?: string | string[] }).message ??
            exception.message);
    } else if (
      exception instanceof DatabaseError &&
      exception.code &&
      exception.code in PG_ERROR_STATUS
    ) {
      status = PG_ERROR_STATUS[exception.code];
      message =
        status === HttpStatus.CONFLICT
          ? 'Resource already exists'
          : 'Invalid reference or value';
    }

    if (status >= 500) {
      this.logger.error(exception);
    }

    res.status(status).json({
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
