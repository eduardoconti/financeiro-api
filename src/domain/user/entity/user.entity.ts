import { AggregateRoot } from '@domain/base/contracts';
import { Email, Name, Password, UUID } from '@domain/base/value-objects';

import { UserStatus } from '../value-objects';
import { UserRoles } from '../value-objects/user-roles.value-object';

export type UserProps = {
  name: Name;
  email: Email;
  password: Password;
  status: UserStatus;
  roles: UserRoles[];
};

export type UserPrimitivesProps = {
  name: string;
  email: string;
  password: string;
  status: string;
  roles: string[];
};

export class UserEntity extends AggregateRoot<UserProps> {
  protected readonly _id!: UUID;

  static create(primitivesProps: UserPrimitivesProps): UserEntity {
    const { name, email, password, status, roles } = primitivesProps;
    const id = UUID.generate();
    return new UserEntity({
      id,
      props: {
        name: new Name(name),
        email: new Email(email),
        password: new Password(password),
        status: new UserStatus(status),
        roles: roles.map((role) => new UserRoles(role)),
      },
    });
  }
}
