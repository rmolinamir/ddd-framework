import { VideoMetadata } from './fixtures/VideoMetadata';
import { VideoMetadataId } from './VideoMetadataId';
import { Video } from './fixtures/Video';
import { VideoId } from './fixtures/VideoId';
import { faker } from '@faker-js/faker';
import { getAggregateRootIdOf } from '../../../src/experimental/decorators/aggregate/root';
import { getEntityIdOf } from '../../../src/experimental/decorators/EntityId';
import EntityCollection from '../../../src/experimental/decorators/EntityCollection';

describe('Aggregate', () => {
  describe('AggregateMember', () => {
    test('debug', () => {
      const video = new Video(
        new VideoId(VideoId.generate()),
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.random.words()
        ),
        EntityCollection.from([
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.random.words()
          ),
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.random.words()
          ),
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.random.words()
          )
        ])
      );

      expect(video).toBeInstanceOf(Video);

      video.metadata.changeTitle(faker.random.words());

      expect(getEntityIdOf(video)).toBe(video.videoId);
      expect(getAggregateRootIdOf(video)).toBe(video.videoId);
      expect(getAggregateRootIdOf(video.metadata)).toBe(video.videoId);

      video.recommendations.add(
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.random.words()
        )
      );
    });
  });
});
