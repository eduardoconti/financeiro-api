import {
  DomainPrimitive,
  ValueObject,
} from '@domain/base/contracts/value-object';
import { ArgumentInvalidException } from '@domain/base/exceptions';

export type UserRolesType = 'ADMIN' | 'USER';

export class UserRoles extends ValueObject<string> {
  public constructor(role: string) {
    super({ value: role });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    const userRoles = ['ADMIN', 'USER'];
    if (!userRoles.includes(value)) {
      throw new ArgumentInvalidException('Invalid user role!');
    }
  }
}
