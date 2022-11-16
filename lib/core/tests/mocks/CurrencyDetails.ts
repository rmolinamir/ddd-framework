import { ValueObject } from '../../src';
import CurrencyMismatchException from './CurrencyMismatchException';
import Money from './Money';

export default class CurrencyDetails extends ValueObject {
  public currencyCode: string;
  public currencySymbol: string;
  public decimalPlaces: number;
  public isCurrencyPrefix: boolean;

  constructor(
    currencyCode: string,
    currencySymbol: string,
    decimalPlaces: number,
    isCurrencyPrefix: boolean
  ) {
    super();
    this.currencyCode = currencyCode;
    this.currencySymbol = currencySymbol;
    this.decimalPlaces = decimalPlaces;
    this.isCurrencyPrefix = isCurrencyPrefix;
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
