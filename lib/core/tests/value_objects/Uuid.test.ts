import { Uuid } from '../../src';
import { CommentId, VideoId } from '../mocks/Video';

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
});
