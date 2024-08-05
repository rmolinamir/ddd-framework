import { ObjectLiteral } from '@ddd-framework/core';
import _ from 'lodash';

import { DeepPartial } from './deep-partial';

/**
 * Applies any optional overrides on an object.
 */
export function applyOverrides<
  ObjectA extends ObjectLiteral,
  ObjectB extends DeepPartial<ObjectA> = DeepPartial<ObjectA>
>(objA: ObjectA, objB: ObjectB | undefined) {
  return _.merge<ObjectA, ObjectB | undefined>(objA, objB);
}
