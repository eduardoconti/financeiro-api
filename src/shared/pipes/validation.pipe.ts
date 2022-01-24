import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  Type,
} from '@nestjs/common';
import { plainToClassFromExist } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClassFromExist(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(ValidationPipe.formatErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: Type<any>): boolean {
    const types: Type<any>[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private static formatErrors(validationErrors: ValidationError[]): string {
    const errorsArray: string[] = [];

    for (const error of validationErrors) {
      let errorsString = '';

      for (const constraint in error.constraints) {
        if (!error.constraints.hasOwnProperty(constraint)) {
          continue;
        }

        errorsString += `${error.constraints[constraint] + '.'}\n`;
      }

      errorsArray.push(errorsString);
    }

    return errorsArray.join('\n');
  }
}
