import 'reflect-metadata';

import { ObjectLiteral } from '../types';

interface MetadataOptions {
  own?: boolean;
}

/**
 * Decorator helper functions.
 */
export class Decorator {
  private constructor() {}

  /**
   * Sets the accessor of a object's property.
   */
  public static setAccessor(
    target: ObjectLiteral,
    propertyKey: PropertyKey,
    propertyDescriptor: {
      get?: (
        instance: ObjectLiteral,
        aggregateMember: ObjectLiteral
      ) => ObjectLiteral;
      set?: (
        instance: ObjectLiteral,
        aggregateMember: ObjectLiteral,
        prevAggregateMember: ObjectLiteral
      ) => void;
    }
  ) {
    const initialValue = target[propertyKey as keyof typeof target];
    const backingField = Symbol(`__${propertyKey.toString()}__`);

    Reflect.defineProperty(target, backingField, {
      configurable: false,
      enumerable: false,
      value: initialValue,
      writable: true
    });

    Reflect.defineProperty(target, propertyKey, {
      get() {
        if (propertyDescriptor.get)
          return propertyDescriptor.get(this, this[backingField]);
        else return this[backingField];
      },
      set(newAggregateMember) {
        const prevAggregateMember = this[backingField];

        this[backingField] = newAggregateMember;

        if (propertyDescriptor.set)
          propertyDescriptor.set(this, this[backingField], prevAggregateMember);
      },
      configurable: false,
      enumerable: true
    });
  }

  /**
   * Sets the watermark of a object.
   */
  public static setWatermark(
    watermarkKey: PropertyKey,
    target: ObjectLiteral
  ): void {
    this.setMetadata(watermarkKey, true, target);
  }

  /**
   * Set the metadata of a object.
   */
  public static setMetadata<MetadataValue>(
    metadataKey: PropertyKey,
    metadataValue: MetadataValue,
    target: ObjectLiteral
  ): void {
    if (target) Reflect.defineMetadata(metadataKey, metadataValue, target);
  }

  /**
   * Returns the aggregate identifier metadata of the object.
   */
  public static getMetadata<Metadata = unknown>(
    metadataSymbol: ReturnType<typeof Symbol>,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): Metadata {
    if (own) return Reflect.getOwnMetadata(metadataSymbol, target) as Metadata;
    else return Reflect.getMetadata(metadataSymbol, target) as Metadata;
  }

  /**
   * Return true if the object has the metadata symbol.
   */
  public static hasMetadata(
    metadataSymbol: ReturnType<typeof Symbol>,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): boolean {
    if (own) return Reflect.hasOwnMetadata(metadataSymbol, target);
    else return Reflect.hasMetadata(metadataSymbol, target);
  }
}
