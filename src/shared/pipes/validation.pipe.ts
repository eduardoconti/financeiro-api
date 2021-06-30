import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException(ValidationPipe.formatErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private static formatErrors(validationErrors: ValidationError[]): string {
    let errorsArray: string[] = [];

    for (let error of validationErrors) {
      let errorsString: string = '';

      for (let constraint in error.constraints) {
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
