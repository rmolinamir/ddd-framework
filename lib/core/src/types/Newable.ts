import { ObjectLiteral } from './ObjectLiteral';

export interface Newable {
  new (...args: any[]): ObjectLiteral;
}
