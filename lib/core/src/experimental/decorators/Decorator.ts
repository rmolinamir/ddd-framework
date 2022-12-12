import 'reflect-metadata';
import { ObjectLiteral } from '../../types';

interface MetadataOptions {
  own?: boolean;
}

// TODO: Abstract reflect-metadata API
export default class Decorator {
  public static setMetadata<MetadataValue>(
    metadataKey: PropertyKey,
    metadataValue: MetadataValue,
    target: ObjectLiteral
  ): void {
    Reflect.defineMetadata(metadataKey, metadataValue, target);
  }

  public static getMetadata<ReturnType = unknown>(
    metadataSymbol: Symbol,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): ReturnType {
    if (own)
      return Reflect.getOwnMetadata(metadataSymbol, target) as ReturnType;
    else return Reflect.getMetadata(metadataSymbol, target) as ReturnType;
  }

  public static hasMetadata(
    metadataSymbol: Symbol,
    target: ObjectLiteral,
    { own = false }: MetadataOptions = {}
  ): boolean {
    if (own) return Reflect.hasOwnMetadata(metadataSymbol, target);
    else return Reflect.hasMetadata(metadataSymbol, target);
  }

  public static stampWatermark(
    watermarKey: PropertyKey,
    target: ObjectLiteral
  ): void {
    this.setMetadata(watermarKey, true, target);
  }
}
