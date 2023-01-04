import EntityCollection from '../EntityCollection';

export function isEntityCollection(arg: unknown): arg is EntityCollection<any> {
  return arg instanceof EntityCollection;
}
