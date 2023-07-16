import { ValueObject } from '@ddd-framework/core';

export default class Address extends ValueObject {
  constructor(
    public readonly country: string,
    public readonly city: string,
    public readonly street: string,
    public readonly zipCode: string
  ) {
    super();
  }

  static Null: Address = new Address('', '', '', '');
}
