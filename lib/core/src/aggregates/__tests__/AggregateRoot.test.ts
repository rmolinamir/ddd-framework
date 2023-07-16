import { faker } from '@faker-js/faker';
import { v4 } from 'uuid';

import Video, {
  CommentEdited,
  CommentLeft,
  VideoId,
  VideoWatched
} from '../../../tests/Video';

describe('AggregateRoot', () => {
  test('equals', () => {
    const idOne = faker.string.uuid();
    const idTwo = faker.string.uuid();

    const videoOne = new Video(new VideoId(idOne));
    const videoTwo = new Video(new VideoId(idOne));
    const videoThree = new Video(new VideoId(idTwo));

    expect(videoOne.equals(videoTwo)).toBe(true);
    expect(videoOne.equals(videoThree)).toBe(false);
  });

  test('raises Domain Event', () => {
    const video = new Video(new VideoId(v4()));

    video.watch();

    const events = video.releasePendingEvents();

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(VideoWatched);
  });

  test('child entity raises Domain Event', () => {
    const video = new Video(new VideoId(v4()));

    const comment = video.leaveComment(faker.word.words());

    expect(video.events()).toHaveLength(1);
    expect(video.events()[0]).toBeInstanceOf(CommentLeft);

    comment.edit(video.id, faker.word.words());

    expect(video.events()).toHaveLength(2);
    expect(video.events()[1]).toBeInstanceOf(CommentEdited);
  });
});
