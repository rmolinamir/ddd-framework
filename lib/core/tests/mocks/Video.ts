import { faker } from '@faker-js/faker';

import { AggregateRoot, DateValue, DomainEvent, Entity, Uuid } from '../../src';

export class VideoWatched extends DomainEvent {
  public static readonly eventType = 'VideoWatched';
  public static readonly eventVersion = faker.system.semver();
}

export class CommentLeft extends DomainEvent<{ text: string }> {
  public static readonly eventType = 'CommentLeft';
  public static readonly eventVersion = faker.system.semver();
}

export class CommentEdited extends DomainEvent<{ text: string }> {
  public static readonly eventType = 'CommentEdited';
  public static readonly eventVersion = faker.system.semver();
}

export class VideoId extends Uuid {}

export class CommentId extends Uuid {}

export class Comment extends Entity<CommentId> {
  constructor(public id: CommentId, public text: string) {
    super();
  }

  public edit(videoId: VideoId, text: string) {
    this.text = text;

    this.raise(
      new CommentEdited({
        text: this.text
      }),
      videoId
    );
  }

  public static create(video: Video, text: string): Comment {
    const comment = new Comment(new CommentId(CommentId.generate()), text);

    video.comments.push(comment);

    comment.raise(
      new CommentLeft({
        text: comment.text
      }),
      video.id
    );

    return comment;
  }
}

export default class Video extends AggregateRoot<VideoId> {
  constructor(
    public id: VideoId,
    public views = 0,
    public comments: Comment[] = []
  ) {
    super();
  }

  public watch() {
    this.views += 1;
    this.raise(
      new VideoWatched(faker.string.uuid(), {
        occurredOn: DateValue.now().iso()
      })
    );
  }

  public leaveComment(text: string): Comment {
    return Comment.create(this, text);
  }

  public getComment(commentId: CommentId): Comment | undefined {
    return this.comments.find((c) => c.id.equals(commentId));
  }
}
