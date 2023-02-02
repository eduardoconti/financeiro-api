import { DomainPrimitive, ValueObject } from '../contracts/value-object';
import { ArgumentInvalidException } from '../exceptions';

export class Description extends ValueObject<string> {
  public constructor(name: string) {
    super({ value: name });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (value.length <= 2 || value.length > 200) {
      throw new ArgumentInvalidException(
        'Description must be greater than 2 chars and less than 200.',
      );
    }
  }
}
