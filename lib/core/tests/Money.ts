import { InvalidOperationException, ValueObject } from '../src';
import CurrencyDetails from './CurrencyDetails';

export default class Money extends ValueObject {
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

  public substract(subtrahend: Money): Money {
    if (this.currency.notEquals(subtrahend.currency))
      throw new InvalidOperationException(
        'Cannot substract amounts with different currencies'
      );

    return new Money(this.amount - subtrahend.amount, this.currency);
  }

  public toString(): string {
    return this.currency.serialize(this);
  }
}
