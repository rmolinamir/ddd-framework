import { ValueObject } from '../../src';
import CurrencyDetails from './CurrencyDetails';
import CurrencyMismatchException from './CurrencyMismatchException';

export default class FakeMoney extends ValueObject {
  public amount: number;

  public currency: CurrencyDetails;

  constructor(amount: number, currency: CurrencyDetails) {
    super();
    this.amount = amount;
    this.currency = currency;
  }

  public add(summand: FakeMoney): FakeMoney {
    if (this.currency.notEquals(summand.currency))
      throw new CurrencyMismatchException(
        'Cannot sum amounts with different currencies'
      );

    return new FakeMoney(this.amount + summand.amount, this.currency);
  }

  public substract(subtrahend: FakeMoney): FakeMoney {
    if (this.currency.notEquals(subtrahend.currency))
      throw new CurrencyMismatchException(
        'Cannot substract amounts with different currencies'
      );

    return new FakeMoney(this.amount - subtrahend.amount, this.currency);
  }

  public toString(): string {
    return this.currency.serialize(this);
  }
}
