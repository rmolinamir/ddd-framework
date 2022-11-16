import Checkpoint from './Checkpoint';

export default abstract class CheckpointStore<
  StoredCheckpoint extends Checkpoint
> {
  public abstract get(
    anIdentity: StoredCheckpoint['id']
  ): Promise<StoredCheckpoint | undefined>;

  public abstract delete(anIdentity: StoredCheckpoint['id']): Promise<void>;

  public abstract store(aCheckpoint: StoredCheckpoint): Promise<void>;
}
