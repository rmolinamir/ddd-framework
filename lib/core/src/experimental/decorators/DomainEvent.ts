import 'reflect-metadata';
import { Newable } from '../../types';
import AggregateIdentifier from './AggregateIdentifier';

export default function DomainEvent(): ClassDecorator {
  return function (Class: Newable) {
    // Validate that it has an AggregateIdentifier?
    Reflect.hasMetadata(AggregateIdentifier.name, Class);
    return Class;
  } as ClassDecorator;
}
