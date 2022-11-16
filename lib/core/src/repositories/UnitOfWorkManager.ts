import UnitOfWork from './UnitOfWork';

export default abstract class UnitOfWorkManager {
  public abstract startUnitOfWork(): Promise<UnitOfWork>;
}
