import { DomainPrimitive } from '../value-objects';

/**
 * Identity `DomainPrimitive` containing unique ID values.
 */
export abstract class Identity<
  Value extends string | number = string | number
> extends DomainPrimitive<Value> {
  public toString() {
    return String(this.value);
  }
}
