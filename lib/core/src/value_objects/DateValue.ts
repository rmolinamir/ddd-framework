import { IllegalStateException } from '../exceptions';
import DomainPrimitive from './DomainPrimitive';

export default class DateValue extends DomainPrimitive<Date> {
  constructor(value: ConstructorParameters<DateConstructor>[number]) {
    super(new Date(value));
  }

  public iso(): string {
    return this.value.toISOString();
  }

  protected validate(): void {
    if (!(this.value instanceof Date) || Number.isNaN(this.value.getTime()))
      throw new IllegalStateException('Invalid date value.');
  }

  public static now(): DateValue {
    return new DateValue(Date.now());
  }

  public static UTC(...params: Parameters<DateConstructor['UTC']>): DateValue {
    return new DateValue(Date.UTC(...params));
  }

  public static parse(
    ...params: Parameters<DateConstructor['parse']>
  ): DateValue {
    return new DateValue(Date.parse(...params));
  }

  public static null = new DateValue(0);
}
