import { InvalidOperationException } from '../exceptions';
import { Decorator } from '../helpers';
import { ObjectLiteral } from '../types';

const METADATA_SYMBOL = Symbol('aggregateMember:metadata');
const WATERMARK_SYMBOL = Symbol('__aggregateMember__');

interface AggregateMemberMetadata {
  propertyKeys: Set<PropertyKey>;
}

/**
 * Decorator that marks a property as the aggregate member.
 * This lets the framework know which properties should be inspected when accessing domain events.
 */
export function AggregateMember(): PropertyDecorator {
  /**
   * This function only runs once at runtime to set up the targetClass property descriptor.
   * All instances share the same `targetClass` variable.
   */
  return function (targetClass: ObjectLiteral, propertyKey: PropertyKey): void {
    const { propertyKeys } = AggregateMember.getMetadata(targetClass) ?? {};
    if (propertyKeys) {
      if (propertyKeys.has(propertyKey)) {
        const name = targetClass.name || 'Object';
        throw new InvalidOperationException(
          `${name} already has an aggregate member with property key ${propertyKey.toString()}.`
        );
      }
      propertyKeys.add(propertyKey);
    } else {
      const metadata: AggregateMemberMetadata = {
        propertyKeys: new Set([propertyKey])
      };

      Decorator.setWatermark(WATERMARK_SYMBOL, targetClass);
      Decorator.setMetadata(METADATA_SYMBOL, metadata, targetClass);

      Decorator.setWatermark(WATERMARK_SYMBOL, targetClass.constructor);
      Decorator.setMetadata(METADATA_SYMBOL, metadata, targetClass.constructor);
    }
  };
}

/**
 * Returns the aggregate members of the object.
 */
AggregateMember.getMembers = function <AggregateMember = unknown>(
  anObject: ObjectLiteral
): AggregateMember[] {
  if (!AggregateMember.hasMembers(anObject)) {
    const name = anObject.name || anObject.constructor?.name || 'Object';
    throw new InvalidOperationException(
      `${name} does not have aggregate members.`
    );
  }

  const metadata = AggregateMember.getMetadata(anObject);

  const members: AggregateMember[] = [];

  for (const propertyKey of metadata!.propertyKeys) {
    const member = anObject[propertyKey];
    if (member) members.push(member);
  }

  return members;
};

/**
 * Returns the aggregate member metadata of the object.
 */
AggregateMember.getMetadata = function (targetClass: ObjectLiteral) {
  return Decorator.getMetadata<AggregateMemberMetadata | undefined>(
    METADATA_SYMBOL,
    targetClass
  );
};

/**
 * Returns true if the object has an aggregate member.
 */
AggregateMember.hasMembers = function (anObject: ObjectLiteral): boolean {
  return Decorator.hasMetadata(WATERMARK_SYMBOL, anObject);
};
