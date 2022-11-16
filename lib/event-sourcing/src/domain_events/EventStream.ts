import { DomainEvent } from '@ddd-framework/core';
import { Readable } from 'stream';
import { ReadableStream } from '../types';

/**
 * Event stream of Domain Events.
 * [Node.js Streams: Everything you need to know](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)
 */
export default abstract class EventStream<
    KnownEvent extends DomainEvent = DomainEvent
  >
  extends Readable
  implements ReadableStream<KnownEvent>
{
  public [Symbol.asyncIterator]: () => AsyncIterableIterator<KnownEvent> =
    super[Symbol.asyncIterator];
}
