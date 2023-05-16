import {
  DomainEvent,
  IdentifiedDomainObject,
  Identity
} from '@ddd-framework/core';

import { Action } from '../types';

export default abstract class Entity<
  Id extends Identity = Identity,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  EntityEvent extends DomainEvent<any> = DomainEvent<any>
> extends IdentifiedDomainObject<Id> {
  constructor(private readonly applier: Action<EntityEvent>) {
    super();
  }

  public apply(anEvent: EntityEvent) {
    this.mutate(anEvent);
    if (this.validateInvariants) this.validateInvariants();
    this.applier(anEvent);
  }

  public mutate(anEvent: EntityEvent): void {
    this.when(anEvent);
  }

  protected abstract when(anEvent: EntityEvent): void;

  protected validateInvariants?(): void;
}
