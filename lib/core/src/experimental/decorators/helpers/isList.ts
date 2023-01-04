import { List } from '../../../value_objects';

export function isList(arg: unknown): arg is List {
  return arg instanceof List;
}
