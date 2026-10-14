import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        const res = http.getResponse<Response>();
        this.logger.log(
          `${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`,
        );
      }),
    );
  }
}
