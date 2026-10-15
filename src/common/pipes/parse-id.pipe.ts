import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

/**
 * Validates a BIGINT id path param. Ids stay strings because pg returns
 * BIGINT as a string to avoid losing precision in JS numbers.
 */
@Injectable()
export class ParseIdPipe implements PipeTransform<string, string> {
  transform(value: string): string {
    if (!/^[1-9]\d{0,18}$/.test(value)) {
      throw new BadRequestException('id must be a positive integer');
    }
    return value;
  }
}
