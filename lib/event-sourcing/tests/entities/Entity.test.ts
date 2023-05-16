import { Uuid } from '@ddd-framework/core';
import { faker } from '@faker-js/faker';

import Picture from '../mocks/Picture';
import * as Events from '../mocks/PictureEvents';

class AggregateId extends Uuid {}

describe('Entity', () => {
  const applier = jest.fn();

  afterEach(() => {
    applier.mockReset();
  });

  test('handles event', () => {
    const picture = new Picture(applier);

    const postId = new AggregateId(faker.string.uuid());
    const pictureId = faker.string.uuid();
    const width = faker.number.int();
    const height = faker.number.int();
    const uri = faker.image.dataUri();

    picture.mutate(
      new Events.PictureCreated({
        postId: postId.unpack(),
        pictureId,
        width,
        height,
        uri
      })
    );

    // Child entity should handle event:
    expect(picture.id.unpack()).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);
  });

  test('apply should handle event then proxy it to the applier', () => {
    const picture = new Picture(applier);

    const postId = new AggregateId(faker.string.uuid());
    const pictureId = faker.string.uuid();
    const width = faker.number.int();
    const height = faker.number.int();
    const uri = faker.image.dataUri();

    const event = new Events.PictureCreated({
      postId: postId.unpack(),
      pictureId,
      width,
      height,
      uri
    });

    picture.apply(event);

    // Child entity should handle event:
    expect(picture.id.unpack()).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);

    // Applier should receive the proxied child entity event:
    expect(applier).toHaveBeenCalled();
    expect(applier).toHaveBeenCalledWith(event);
  });

  test('apply should handle multiple events then proxy all of them to the applier', () => {
    const picture = new Picture(applier);

    const postId = new AggregateId(faker.string.uuid());
    const pictureId = faker.string.uuid();
    const uri = faker.image.dataUri();

    let width = faker.number.int();
    let height = faker.number.int();

    const pictureCreated = new Events.PictureCreated({
      postId: postId.unpack(),
      pictureId,
      width,
      height,
      uri
    });

    picture.apply(pictureCreated);

    width = faker.number.int();
    height = faker.number.int();

    const pictureResized = new Events.PictureResized({
      postId: postId.unpack(),
      pictureId,
      width,
      height
    });

    picture.apply(pictureResized);

    // Applier should receive the proxied child entity event:
    expect(applier).toHaveBeenCalledTimes(2);
    expect(applier.mock.calls[0][0]).toBe(pictureCreated);
    expect(applier.mock.calls[1][0]).toBe(pictureResized);

    // Child entity should handle events:
    expect(picture.id.unpack()).toBe(pictureId);
    expect(picture.size.width).toBe(width);
    expect(picture.size.height).toBe(height);
    expect(picture.uri.uri).toBe(uri);
  });

  describe('Picture', () => {
    test('resize', () => {
      const picture = new Picture(applier);

      const postId = new AggregateId(faker.string.uuid());
      const pictureId = faker.string.uuid();
      const uri = faker.image.dataUri();

      let width = faker.number.int();
      let height = faker.number.int();

      const pictureCreated = new Events.PictureCreated({
        postId: postId.unpack(),
        pictureId,
        width,
        height,
        uri
      });

      picture.apply(pictureCreated);

      width = faker.number.int();
      height = faker.number.int();

      picture.resize(width, height);

      // Child entity should handle events:
      expect(picture.id.unpack()).toBe(pictureId);
      expect(picture.size.width).toBe(width);
      expect(picture.size.height).toBe(height);
      expect(picture.uri.uri).toBe(uri);

      // Applier should receive the proxied child entity event:
      expect(applier).toHaveBeenCalledTimes(2);
      expect(applier.mock.calls[0][0]).toBe(pictureCreated);
      expect(applier.mock.calls[1][0]).toBeInstanceOf(Events.PictureResized);
    });
  });
});
