import * as nanoid from 'nanoid';

import { UUID } from '../value-objects/uuid.value-object';

export type CommandProps<T> = Omit<T, 'correlationId' | 'id'> &
  Partial<Command>;

export class Command {
  /**
   * Command id, in case if we want to save it
   * for auditing purposes and create a correlation/causation chain
   */
  public readonly id: string;

  /** ID for correlation purposes (for UnitOfWork, for commands that
   *  arrive from other microservices,logs correlation etc). */
  public readonly correlationId: string;

  /**
   * Causation id to reconstruct execution ordering if needed
   */
  public readonly causationId?: string;

  constructor(props?: CommandProps<unknown>) {
    this.correlationId = props?.correlationId || nanoid.nanoid(8);
    this.id = props?.id || UUID.generate().value;
  }
}
