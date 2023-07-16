import { AggregateRoot, Entity } from '@ddd-framework/core';

import Uuid from '../Uuid';

export class VideoId extends Uuid {}

export class CommentId extends Uuid {}

describe('Uuid', () => {
  test('equality of two UUID subclasses', () => {
    const commentId = new CommentId(CommentId.generate());
    const videoId = new VideoId(commentId.unpack());

    expect(commentId.unpack()).toBe(videoId.unpack()); // Attributes are the same

    expect(commentId.equals(videoId)).toBe(false);
  });

  test('equality of a UUID subclasses and its UUID superclass', () => {
    const uuid = new Uuid(Uuid.generate());
    const commentId = new CommentId(uuid.unpack());

    expect(uuid.unpack()).toBe(commentId.unpack()); // Attributes are the same

    expect(uuid.equals(commentId)).toBe(false);
  });

  test('equality of two UUID instances', () => {
    const firstUuid = new Uuid(Uuid.generate());
    const secondUuid = new Uuid(firstUuid.unpack());

    expect(firstUuid.unpack()).toBe(secondUuid.unpack()); // Attributes are the same

    expect(firstUuid.equals(secondUuid)).toBe(true);
  });

  test('toString', () => {
    const uuidString = Uuid.generate();
    const uuid = new Uuid(uuidString);
    expect(uuid.toString()).toBe(uuidString);
    expect(`${uuid}`).toBe(uuidString);
  });

  describe('Entity compatibility', () => {
    test('AggregateRoot equality', () => {
      class Video extends AggregateRoot<VideoId> {
        constructor(public readonly id: VideoId) {
          super();
        }
      }

      const firstVideo = new Video(new VideoId(VideoId.generate()));
      const secondVideo = new Video(new VideoId(VideoId.generate()));

      expect(firstVideo.id.equals(secondVideo.id)).toBe(false);
      expect(firstVideo.id.unpack()).not.toBe(secondVideo.id.unpack());
    });

    test('Entity equality', () => {
      class Comment extends Entity<CommentId> {
        constructor(public readonly id: CommentId) {
          super();
        }
      }

      const firstVideo = new Comment(new CommentId(CommentId.generate()));
      const secondVideo = new Comment(new CommentId(CommentId.generate()));

      expect(firstVideo.id.equals(secondVideo.id)).toBe(false);
      expect(firstVideo.id.unpack()).not.toBe(secondVideo.id.unpack());
    });
  });
});
