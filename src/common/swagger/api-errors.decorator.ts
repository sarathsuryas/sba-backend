import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../dto/error-response.dto.js';

type ErrorKind = 'badRequest' | 'notFound' | 'conflict';

const ERROR_DECORATORS: Record<
  ErrorKind,
  () => MethodDecorator & ClassDecorator
> = {
  badRequest: () =>
    ApiBadRequestResponse({
      description: 'Validation failed',
      type: ErrorResponseDto,
    }),
  notFound: () =>
    ApiNotFoundResponse({
      description: 'Resource not found',
      type: ErrorResponseDto,
    }),
  conflict: () =>
    ApiConflictResponse({
      description: 'Resource already exists',
      type: ErrorResponseDto,
    }),
};

/** Documents error responses that share the ErrorResponseDto shape. */
export function ApiErrors(...kinds: ErrorKind[]) {
  return applyDecorators(...kinds.map((kind) => ERROR_DECORATORS[kind]()));
}

/**
 * Marks a route as needing a bearer token and documents the 401, plus 403
 * when `roles` are given.
 */
export function ApiAuth(...roles: string[]) {
  const decorators = [
    ApiBearerAuth(),
    ApiUnauthorizedResponse({
      description: 'Missing, invalid, or expired token',
      type: ErrorResponseDto,
    }),
  ];
  if (roles.length) {
    decorators.push(
      ApiForbiddenResponse({
        description: `Requires role: ${roles.join(' or ')}`,
        type: ErrorResponseDto,
      }),
    );
  }
  return applyDecorators(...decorators);
}
