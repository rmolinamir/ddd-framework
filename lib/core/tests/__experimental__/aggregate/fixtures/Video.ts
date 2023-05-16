import Entity from '../../../../src/experimental/decorators/Entity';
import EntityCollection from '../../../../src/experimental/decorators/EntityCollection';
import EntityId from '../../../../src/experimental/decorators/EntityId';
import { VideoMetadata } from './VideoMetadata';
import { VideoId } from './VideoId';
import { AggregateRoot } from '../../../../src/experimental/decorators/aggregate/root';
import { AggregateMember } from '../../../../src/experimental/decorators/aggregate/member';

@AggregateRoot()
export class Video extends Entity {
  @EntityId()
  public videoId: VideoId;

  public views = 0;

  public comments: Comment[] = [];

  @AggregateMember()
  public metadata: VideoMetadata;

  @AggregateMember()
  public recommendations: EntityCollection<VideoMetadata>;

  constructor(
    id: VideoId,
    metadata: VideoMetadata,
    recommendations: EntityCollection<VideoMetadata>
  ) {
    super();
    this.videoId = id;
    this.metadata = metadata;
    this.recommendations = recommendations;
  }

  public watch() {
    this.views += 1;
  }
}
