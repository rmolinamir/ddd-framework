import { ValueObject } from '@ddd-framework/core';

import CurrencyDetails from './CurrencyDetails';
import CurrencyMismatchException from './CurrencyMismatchException';

export default class Money extends ValueObject {
  constructor(
    public readonly amount: number,
    public readonly currency: CurrencyDetails
  ) {
    super();
  }

  public add(summand: Money): Money {
    if (this.currency.notEquals(summand.currency))
      throw new CurrencyMismatchException(
        'Cannot sum amounts with different currencies'
      );

    return new Money(this.amount + summand.amount, this.currency);
  }

  public substract(subtrahend: Money): Money {
    if (this.currency.notEquals(subtrahend.currency))
      throw new CurrencyMismatchException(
        'Cannot substract amounts with different currencies'
      );

    return new Money(this.amount - subtrahend.amount, this.currency);
  }

  public toString(): string {
    return this.currency.serialize(this);
  }
}
