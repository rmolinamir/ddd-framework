import { ValueObject } from '@ddd-framework/core';
import CurrencyMismatchException from './CurrencyMismatchException';
import Money from './Money';

export default class CurrencyDetails extends ValueObject {
  constructor(
    public readonly currencyCode: string,
    public readonly currencySymbol: string,
    public readonly decimalPlaces: number,
    public readonly isCurrencyPrefix: boolean
  ) {
    super();
  }

  public serialize(money: Money): string {
    if (money.currency.notEquals(this))
      throw new CurrencyMismatchException(
        'Cannot serialize money from another currency'
      );

    return this.isCurrencyPrefix
      ? `${this.currencySymbol}${money.amount}`
      : `${money.amount}${this.currencySymbol}`;
  }
}
