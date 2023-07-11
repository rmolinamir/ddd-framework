import 'reflect-metadata';

import { ObjectLiteral } from '../../types';

interface MetadataOptions {
  own?: boolean;
}

export default class Decorator {
  private constructor() {}

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

  public static setWatermark(
    watermarkKey: PropertyKey,
    target: ObjectLiteral
  ): void {
    this.setMetadata(watermarkKey, true, target);
  }

  public static setMetadata<MetadataValue>(
    metadataKey: PropertyKey,
    metadataValue: MetadataValue,
    target: ObjectLiteral
  ): void {
    if (target) Reflect.defineMetadata(metadataKey, metadataValue, target);
  }

  public static getMetadata<Metadata = unknown>(
    metadataSymbol: ReturnType<typeof Symbol>,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): Metadata {
    if (own) return Reflect.getOwnMetadata(metadataSymbol, target) as Metadata;
    else return Reflect.getMetadata(metadataSymbol, target) as Metadata;
  }

  public static hasMetadata(
    metadataSymbol: ReturnType<typeof Symbol>,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): boolean {
    if (own) return Reflect.hasOwnMetadata(metadataSymbol, target);
    else return Reflect.hasMetadata(metadataSymbol, target);
  }
}
