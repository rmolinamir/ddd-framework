export default abstract class UnitOfWork {
  public abstract start?(): Promise<void>;

  public abstract commit(): Promise<void>;

  public abstract rollback(): Promise<void>;
}
