import { faker } from '@faker-js/faker';

import {
  getAggregateRootIdOf,
  hasAggregateRootRef
} from '../../../src/__experimental__/decorators/aggregate/root';
import EntityCollection from '../../../src/__experimental__/decorators/EntityCollection';
import { getEntityIdOf } from '../../../src/__experimental__/decorators/EntityId';
import { Choice } from './fixtures/Choice';
import { ChoiceId } from './fixtures/ChoiceId';
import { Service } from './fixtures/Service';
import { ServiceId } from './fixtures/ServiceId';
import { Specification } from './fixtures/Specification';
import { SpecificationId } from './fixtures/SpecificationId';
import { Video } from './fixtures/Video';
import { VideoId } from './fixtures/VideoId';
import { VideoMetadata } from './fixtures/VideoMetadata';
import { VideoMetadataId } from './VideoMetadataId';

describe('Aggregate', () => {
  describe('AggregateMember', () => {
    test('debug', () => {
      const video = new Video(
        new VideoId(VideoId.generate()),
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.word.words()
        ),
        EntityCollection.from([
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.word.words()
          ),
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.word.words()
          ),
          new VideoMetadata(
            new VideoMetadataId(VideoMetadataId.generate()),
            faker.word.words()
          )
        ])
      );

      video.metadata.changeTitle(faker.word.words());

      expect(getEntityIdOf(video)).toBe(video.videoId);
      expect(getAggregateRootIdOf(video)).toBe(video.videoId);
      expect(getAggregateRootIdOf(video.metadata)).toBe(video.videoId);

      video.recommendations.add(
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.word.words()
        )
      );

      video.recommendations.forEach((e) => {
        const isInAggregate = hasAggregateRootRef(e);
        expect(isInAggregate).toBe(true);
      });
    });

    test('debug service aggregate', () => {
      const service = new Service(
        new ServiceId(ServiceId.generate()),
        EntityCollection.from([
          new Specification(
            new SpecificationId(SpecificationId.generate()),
            faker.word.words(),
            EntityCollection.from([
              new Choice(new ChoiceId(ChoiceId.generate()), faker.word.words()),
              new Choice(new ChoiceId(ChoiceId.generate()), faker.word.words())
            ])
          ),
          new Specification(
            new SpecificationId(SpecificationId.generate()),
            faker.word.words(),
            new EntityCollection()
          )
        ])
      );

      const aggregateRootId = getAggregateRootIdOf(service);

      expect(getEntityIdOf(service)).toBe(service.serviceId);
      expect(aggregateRootId).toBe(service.serviceId);

      expect(getAggregateRootIdOf(service.specifications)).toBe(
        service.serviceId
      );

      service.specifications.add(
        new Specification(
          new SpecificationId(SpecificationId.generate()),
          faker.word.words(),
          new EntityCollection()
        )
      );

      service.specifications.lastInserted.choices
        .add(new Choice(new ChoiceId(ChoiceId.generate()), faker.word.words()))
        .add(new Choice(new ChoiceId(ChoiceId.generate()), faker.word.words()));

      for (const spec of service.specifications) {
        const specAggregateRootId = getAggregateRootIdOf(spec);
        expect(specAggregateRootId).toBe(service.serviceId);

        expect(getAggregateRootIdOf(spec.choices)).toBe(service.serviceId);

        for (const choice of spec.choices) {
          const choiceAggregateRootId = getAggregateRootIdOf(choice);
          expect(choiceAggregateRootId).toBe(service.serviceId);
        }
      }
    });

    test('aggregate member debug', () => {
      const video1 = new Video(
        new VideoId(VideoId.generate()),
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.word.words()
        ),
        new EntityCollection()
      );

      const video2 = new Video(
        new VideoId(VideoId.generate()),
        new VideoMetadata(
          new VideoMetadataId(VideoMetadataId.generate()),
          faker.word.words()
        ),
        new EntityCollection()
      );

      expect(getAggregateRootIdOf(video1)).toBe(video1.videoId);
      expect(getAggregateRootIdOf(video1.metadata)).toBe(video1.videoId);
      expect(getAggregateRootIdOf(video2)).toBe(video2.videoId);
      expect(getAggregateRootIdOf(video2.metadata)).toBe(video2.videoId);

      video1.metadata = new VideoMetadata(
        new VideoMetadataId(VideoMetadataId.generate()),
        faker.word.words()
      );

      video2.metadata = new VideoMetadata(
        new VideoMetadataId(VideoMetadataId.generate()),
        faker.word.words()
      );

      expect(getAggregateRootIdOf(video1.metadata)).toBe(video1.videoId);
      expect(getAggregateRootIdOf(video2.metadata)).toBe(video2.videoId);
    });
  });
});
