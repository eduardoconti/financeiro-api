import { ValidationError } from 'class-validator';

export class ValidationErrorDTO {
  constructor(public readonly name: string, public readonly reason: string) {}

  static build(validationErrors: ValidationError[] = []): ValidationErrorDTO[] {
    let errors: ValidationErrorDTO[] = [];
    validationErrors.forEach((validationError: ValidationError): any => {
      const { property, constraints = {} } = validationError;

      if (validationError.children) {
        errors = [
          ...errors,
          ...ValidationErrorDTO.build(validationError.children),
        ];
      }
      Object.keys(constraints).forEach((prop: any) => {
        errors.push(new ValidationErrorDTO(property, constraints[prop]));
      });
    });
    return errors;
  }
}
