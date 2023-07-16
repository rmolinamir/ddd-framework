import { DomainEvent } from '@ddd-framework/core';

export class PictureCreated extends DomainEvent<{
  readonly postId: string;
  readonly pictureId: string;
  readonly height: number;
  readonly width: number;
  readonly uri: string;
}> {
  public static readonly eventType = 'PictureCreated';
  public static readonly eventVersion = '0';
}

export class PictureResized extends DomainEvent<{
  readonly postId: string;
  readonly pictureId: string;
  readonly height: number;
  readonly width: number;
}> {
  public static readonly eventType = 'PictureResized';
  public static readonly eventVersion = '0';
}

export type PictureEvents = PictureCreated | PictureResized;
