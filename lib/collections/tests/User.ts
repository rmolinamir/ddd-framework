import { Entity, Identity, IllegalStateException } from '@ddd-framework/core';
import { validate } from 'uuid';

export class UserId extends Identity<string> {
  public validate(): void {
    if (!validate(this.value)) throw new IllegalStateException('Invalid ID.');
  }
}

export default class User extends Entity<UserId> {
  public id: UserId;

  constructor(id: UserId) {
    super();
    this.id = id;
  }
}
