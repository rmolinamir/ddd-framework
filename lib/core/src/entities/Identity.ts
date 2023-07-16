import { DomainPrimitive } from '../value_objects';

/**
 * Identity `DomainPrimitive` containing unique ID values.
 */
export default abstract class Identity<
  Value extends string | number = string | number
> extends DomainPrimitive<Value> {
  public toString() {
    return String(this.value);
  }
}
