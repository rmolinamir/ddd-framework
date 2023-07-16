import { ArgumentException } from '../exceptions';
import ValueObject from './ValueObject';

type SymbolPrimitiveHint = 'string' | 'number' | 'default';

export type Primitive = string | number | boolean | Date;

/**
 * Domain primitives turn implicit concepts explicit. They are behavior-oriented value
 * objects with self-validation, and they are the smallest component of the business
 * domain that can be used to build complex combinations.
 *
 * [Domain-driven Design: Domain Primitive](https://alibaba-cloud.medium.com/an-alibaba-cloud-technical-experts-insight-into-domain-driven-design-domain-primitive-c569986cebcd)
 */
export default abstract class DomainPrimitive<
  T extends Primitive
> extends ValueObject {
  constructor(protected readonly value: T) {
    super();
    this.validate();
  }

  /**
   * Returns the DomainPrimitive value.
   */
  public unpack(): T {
    return this.value;
  }

  public equals(object: DomainPrimitive<T>): boolean {
    const typesAreEqual = this.constructor === object.constructor;
    if (!typesAreEqual) return false;
    else if (this.value instanceof Date && object.value instanceof Date)
      return this.value.getTime() === object.value.getTime();
    else return this.value === object.value;
  }

  /**
   * Converts a DomainPrimitive object to a string.
   */
  public [Symbol.toPrimitive](hint: 'string'): string;
  /**
   * Converts a DomainPrimitive object to a number.
   */
  public [Symbol.toPrimitive](hint: 'number'): number;
  /**
   * Converts a DomainPrimitive object to a string.
   */
  public [Symbol.toPrimitive](hint: 'default'): string;
  /**
   * Converts a DomainPrimitive object to a string or number.
   *
   * @param hint The strings "number", "string", or "default" to specify what primitive to return.
   *
   * @throws {TypeError} If 'hint' was given something other than "number", "string", or "default".
   * @returns A number if 'hint' was "number", a string if 'hint' was "string" or "default".
   */
  public [Symbol.toPrimitive](hint: SymbolPrimitiveHint): string | number {
    switch (hint) {
      case 'string':
        return String(this.value);
      case 'number':
        return Number(this.value);
      case 'default':
        return String(this.value);
      default:
        throw new ArgumentException(
          'hint',
          'The hint cannot be something other than "number", "string", or "default".'
        );
    }
  }

  protected abstract validate(): void;

  public static isDomainPrimitive<T extends Primitive>(
    obj: unknown
  ): obj is DomainPrimitive<T> {
    return obj instanceof DomainPrimitive;
  }
}
