import Entity from '../Entity';

export function isEntity(arg: unknown): arg is Entity {
  return arg instanceof Entity;
}
