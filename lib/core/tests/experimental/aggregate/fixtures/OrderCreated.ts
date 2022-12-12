import { DomainEvent } from '../../../../src/experimental/decorators/domain_events';

@DomainEvent('video-metadata-title-updated', '0.0.0')
export class VideoMetadataTitleUpdated {
  constructor(
    public videoId: string,
    public videoMetadataId: string,
    public title: string
  ) {}
}
