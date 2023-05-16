import { DomainEvent } from '@ddd-framework/core';
import { Transform, TransformCallback, TransformOptions } from 'stream';

import { ReadableStream } from '../types';

/**
 * Event stream of Domain Events.
 * [Node.js Streams: Everything you need to know](https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/)
 */
export default class WritableEventStream<
    KnownEvent extends DomainEvent = DomainEvent,
    Chunk = unknown
  >
  extends Transform
  implements ReadableStream<KnownEvent>
{
  constructor(
    transform: (chunk: Chunk) => KnownEvent,
    opts: Omit<TransformOptions, 'transform'> = {}
  ) {
    super(WritableEventStream.getTransformOptions(transform, opts));
  }

  public [Symbol.asyncIterator]: () => AsyncIterableIterator<KnownEvent> =
    super[Symbol.asyncIterator];

  private static getTransformOptions<
    KnownEvent extends DomainEvent = DomainEvent,
    Chunk = unknown
  >(
    transform: (chunk: Chunk) => KnownEvent,
    opts: Omit<TransformOptions, 'transform'>
  ): TransformOptions {
    const transformOptions = opts as TransformOptions;

    if (transform) {
      transformOptions.readableObjectMode = true;
      transformOptions.writableObjectMode = true;
      transformOptions.transform = function (
        chunk: any,
        _: BufferEncoding,
        callback: TransformCallback
      ): void {
        const event = transform(chunk);
        this.push(event);
        callback();
      };
    }

    return opts;
  }
}
