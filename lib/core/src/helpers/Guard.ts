import _ from 'lodash';

export default class Guard {
  /**
   * Checks if `value` is `null`, `undefined`, `NaN`, or an empty string.
   * @param value The value to check.
   * @returns Returns `true` if `value` is nullish (i.e. empty), else `false`.
   */
  public static isEmpty(value: unknown): boolean {
    return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
  }
}
