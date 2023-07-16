import { Entity } from '../src';
import * as Events from './PictureEvents';
import PictureId from './PictureId';
import PictureSize from './PictureSize';
import PostId from './PostId';
import Uri from './Uri';

export default class Picture extends Entity<PictureId, Events.PictureEvents> {
  public postId: PostId = PostId.Null;

  public id: PictureId = PictureId.Null;

  public size: PictureSize = PictureSize.Null;

  public uri: Uri = Uri.Null;

  public resize(width: number, height: number) {
    this.apply(
      new Events.PictureResized({
        postId: this.postId.unpack(),
        pictureId: this.id.unpack(),
        width,
        height
      })
    );
  }

  protected when(event: Events.PictureEvents) {
    if (event instanceof Events.PictureCreated) {
      this.postId = new PostId(event.data.postId);
      this.id = new PictureId(event.data.pictureId);
      this.size = new PictureSize(event.data.width, event.data.height);
      this.uri = new Uri(event.data.uri);
    } else if (event instanceof Events.PictureResized) {
      this.size = new PictureSize(event.data.width, event.data.height);
    }
  }
}
