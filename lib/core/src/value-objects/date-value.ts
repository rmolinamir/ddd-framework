import { IllegalStateException } from '../exceptions';
import { DomainPrimitive } from './domain-primitive';

/**
 * Domain primitive representing a date value.
 */
export class DateValue extends DomainPrimitive<Date> {
  constructor(value: ConstructorParameters<DateConstructor>[number]) {
    super(new Date(value));
  }

  /**
   * Returns the date value as a string.
   */
  public iso(): string {
    return this.value.toISOString();
  }

  /**
   * Returns the date value as a string.
   */
  protected validate(): void {
    if (!(this.value instanceof Date) || Number.isNaN(this.value.getTime()))
      throw new IllegalStateException('Invalid date value.');
  }

  /**
   * Returns the date value as a string.
   */
  public static now(): DateValue {
    return new DateValue(Date.now());
  }

  /**
   * Returns the date value as a string.
   */
  public static UTC(...params: Parameters<DateConstructor['UTC']>): DateValue {
    return new DateValue(Date.UTC(...params));
  }

  /**
   * Returns the date value as a string.
   */
  public static parse(
    ...params: Parameters<DateConstructor['parse']>
  ): DateValue {
    return new DateValue(Date.parse(...params));
  }

  /**
   * Represents a null date value.
   */
  public static null = new DateValue(0);
}
