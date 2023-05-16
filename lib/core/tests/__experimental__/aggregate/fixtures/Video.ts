import { AggregateMember } from '../../../../src/__experimental__/decorators/aggregate/member';
import { AggregateRoot } from '../../../../src/__experimental__/decorators/aggregate/root';
import Entity from '../../../../src/__experimental__/decorators/Entity';
import EntityCollection from '../../../../src/__experimental__/decorators/EntityCollection';
import EntityId from '../../../../src/__experimental__/decorators/EntityId';
import { VideoId } from './VideoId';
import { VideoMetadata } from './VideoMetadata';

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
