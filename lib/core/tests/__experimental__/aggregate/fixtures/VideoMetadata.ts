import Entity from '../../../../src/__experimental__/decorators/Entity';
import EntityId from '../../../../src/__experimental__/decorators/EntityId';
import { VideoMetadataId } from '../VideoMetadataId';
import { VideoMetadataTitleUpdated } from './OrderCreated';
import { VideoId } from './VideoId';

export class VideoMetadata extends Entity {
  @EntityId()
  public id: VideoMetadataId;

  constructor(id: VideoMetadataId, public title: string) {
    super();
    this.id = id;
  }

  public changeTitle(title: string) {
    this.title = title;

    this.raise(
      new VideoMetadataTitleUpdated(
        this.aggregateRootId<VideoId>().unpack(),
        this.id.unpack(),
        this.title
      )
    );
  }
}
