import { UnitOfWork } from './unit-of-work';

export abstract class UnitOfWorkManager {
  public abstract startUnitOfWork(): Promise<UnitOfWork>;
}
