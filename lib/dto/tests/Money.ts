import { InvalidOperationException, ValueObject } from '@ddd-framework/core';

import { CurrencyDetails } from './currency-details';

export class Money extends ValueObject {
  public amount: number;

  public currency: CurrencyDetails;

  constructor(amount: number, currency: CurrencyDetails) {
    super();
    this.amount = amount;
    this.currency = currency;
  }

  public add(summand: Money): Money {
    if (this.currency.notEquals(summand.currency))
      throw new InvalidOperationException(
        'Cannot sum amounts with different currencies'
      );

    return new Money(this.amount + summand.amount, this.currency);
  }

  public subtract(subtrahend: Money): Money {
    if (this.currency.notEquals(subtrahend.currency))
      throw new InvalidOperationException(
        'Cannot subtract amounts with different currencies'
      );

    return new Money(this.amount - subtrahend.amount, this.currency);
  }

  public toString(): string {
    return this.currency.toString(this);
  }
}
