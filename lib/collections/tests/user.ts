import {
  Entity,
  EntityId,
  Identity,
  IllegalStateException
} from '@ddd-framework/core';

export class UserId extends Identity {
  protected validate(): void {
    if (!this.value) throw new IllegalStateException('id is required');
  }
}

export class User extends Entity {
  @EntityId()
  public id: UserId;

  constructor(id: UserId) {
    super();
    this.id = id;
  }
}
