import { Readable } from 'stream';

export interface ReadableStream<Chunk> extends Readable {
  addListener(event: 'close', listener: () => void): this;
  addListener(event: 'data', listener: (event: Chunk) => void): this;
  addListener(event: 'end', listener: () => void): this;
  addListener(event: 'readable', listener: () => void): this;
  addListener(event: 'error', listener: (err: Error) => void): this;
  addListener(event: 'confirmation', listener: () => void): this;
  addListener(
    event: string | symbol,
    listener: (...args: unknown[]) => void
  ): this;
  on(event: 'close', listener: () => void): this;
  on(event: 'data', listener: (event: Chunk) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'readable', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'confirmation', listener: () => void): this;
  on(event: string | symbol, listener: (...args: unknown[]) => void): this;
  once(event: 'close', listener: () => void): this;
  once(event: 'data', listener: (event: Chunk) => void): this;
  once(event: 'end', listener: () => void): this;
  once(event: 'readable', listener: () => void): this;
  once(event: 'error', listener: (err: Error) => void): this;
  once(event: 'confirmation', listener: () => void): this;
  once(event: string | symbol, listener: (...args: unknown[]) => void): this;
  prependListener(event: 'close', listener: () => void): this;
  prependListener(event: 'data', listener: (event: Chunk) => void): this;
  prependListener(event: 'end', listener: () => void): this;
  prependListener(event: 'readable', listener: () => void): this;
  prependListener(event: 'error', listener: (err: Error) => void): this;
  prependListener(event: 'confirmation', listener: () => void): this;
  prependListener(
    event: string | symbol,
    listener: (...args: unknown[]) => void
  ): this;
  prependOnceListener(event: 'close', listener: () => void): this;
  prependOnceListener(event: 'data', listener: (event: Chunk) => void): this;
  prependOnceListener(event: 'end', listener: () => void): this;
  prependOnceListener(event: 'readable', listener: () => void): this;
  prependOnceListener(event: 'error', listener: (err: Error) => void): this;
  prependOnceListener(event: 'confirmation', listener: () => void): this;
  prependOnceListener(
    event: string | symbol,
    listener: (...args: unknown[]) => void
  ): this;
  removeListener(event: 'close', listener: () => void): this;
  removeListener(event: 'data', listener: (event: Chunk) => void): this;
  removeListener(event: 'end', listener: () => void): this;
  removeListener(event: 'readable', listener: () => void): this;
  removeListener(event: 'error', listener: (err: Error) => void): this;
  removeListener(event: 'confirmation', listener: () => void): this;
  removeListener(
    event: string | symbol,
    listener: (...args: unknown[]) => void
  ): this;
  [Symbol.asyncIterator](): AsyncIterableIterator<Chunk>;
}
