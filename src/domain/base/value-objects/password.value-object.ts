import { DomainPrimitive, ValueObject } from '../contracts/value-object';
import { ArgumentInvalidException } from '../exceptions';

export class Password extends ValueObject<string> {
  public constructor(value: string) {
    super({ value });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    if (!value) {
      throw new ArgumentInvalidException('password must be not empty');
    }
  }
}
