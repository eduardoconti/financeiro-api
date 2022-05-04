import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Type,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

import { ValidationErrorDTO } from '@config/dto';
import { BadRequestException } from '@config/exceptions';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value, { exposeUnsetFields: false });
    const errors = await validate(object);

    if (errors.length > 0) {
      const requestErrors = ValidationErrorDTO.build(errors);
      throw new BadRequestException(
        'Invalid request body',
        'Some fields are in wrong format',
        requestErrors,
      );
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
