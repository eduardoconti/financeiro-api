import {
  DomainPrimitive,
  ValueObject,
} from '@domain/base/contracts/value-object';
import { ArgumentInvalidException } from '@domain/base/exceptions';

export type UserStatusType = 'PENDING' | 'ACTIVE';

export class UserStatus extends ValueObject<string> {
  public constructor(role: string) {
    super({ value: role });
  }

  get value(): string {
    return this.props.value;
  }

  protected validate({ value }: DomainPrimitive<string>): void {
    const userStatus = ['PENDING', 'ACTIVE'];
    if (!userStatus.includes(value)) {
      throw new ArgumentInvalidException('Invalid user status!');
    }
  }
}
