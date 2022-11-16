/**
 * NOTES:
 * Ideally the framework could just hook into the models through decorators.
 * It would be great to base it on the Axon framework, here's a couple examples:
 * - https://github.com/AxonFramework/AxonFramework/blob/master/integrationtests/src/test/java/org/axonframework/integrationtests/modelling/command/ComplexAggregateStructureTest.java
 * - https://discuss.axoniq.io/t/does-axon-framework-support-nested-child-entities-in-an-aggregate/3673/5
 */

import { faker } from '@faker-js/faker';
import { AggregateRoot, DomainEvent, Newable, Uuid } from '../../src';

/**
 * AggregateRoot as a decorator rather than a class?
 */
function AggregateRootV2(): ClassDecorator {
  return function (Class: Newable) {
    // TODO: Define metadata? Validate that an AggregateIdentifier exists?
    return Class;
  } as ClassDecorator;
}

class VideoWatched extends DomainEvent {
  public static readonly eventType = 'VideoWatched';
  public static readonly eventVersion = faker.system.semver();
}

class VideoId extends Uuid {}

@AggregateRootV2()
class Video extends AggregateRoot<VideoId> {
  constructor(
    public id: VideoId,
    public views = 0,
    public comments: Comment[] = []
  ) {
    super();
  }

  public watch() {
    this.views += 1;
    this.raise(new VideoWatched(faker.datatype.uuid()));
  }
}

describe('AggregateRootV2', () => {
  test('equals', () => {
    const idOne = faker.datatype.uuid();
    const idTwo = faker.datatype.uuid();

    const videoOne = new Video(new VideoId(idOne));
    const videoTwo = new Video(new VideoId(idOne));
    const videoThree = new Video(new VideoId(idTwo));

    expect(videoOne.equals(videoTwo)).toBe(true);
    expect(videoOne.equals(videoThree)).toBe(false);
  });

  test('raises Domain Event', () => {
    const video = new Video(new VideoId(VideoId.generate()));

    video.watch();

    const events = video.releasePendingEvents();

    expect(events).toHaveLength(1);
    expect(events[0]).toBeInstanceOf(VideoWatched);
  });
});
