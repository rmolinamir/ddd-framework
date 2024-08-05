import { UnitOfWork } from './unit-of-work';

/**
 * Represents a Unit of Work Manager, which is responsible for managing the lifecycle of Unit of Work instances.
 * The Unit of Work pattern is a design pattern used in domain-driven design to maintain consistency and integrity
 * within a transactional boundary.
 *
 * @remarks
 * For more information on the Unit of Work pattern and domain-driven design, refer to Martin Fowler's articles:
 * - [Unit of Work](https://martinfowler.com/eaaCatalog/unitOfWork.html)
 *
 * @public
 * @abstract
 */
export abstract class UnitOfWorkManager {
  /**
   * Starts a new Unit of Work and returns a Promise that resolves to the created UnitOfWork instance.
   *
   * @returns A Promise that resolves to a UnitOfWork instance representing the started Unit of Work.
   *
   * @remarks
   * The Unit of Work pattern encapsulates a set of operations that should be treated as a single transaction.
   * This method is responsible for creating and initializing a new UnitOfWork instance.
   *
   * @example
   * ```typescript
   * const unitOfWork = await unitOfWorkManager.startUnitOfWork();
   * // Perform operations within the Unit of Work
   * await unitOfWork.commit();
   * ```
   *
   * @throws {Error} If an error occurs while starting the Unit of Work.
   *
   * @public
   * @abstract
   */
  public abstract startUnitOfWork(): Promise<UnitOfWork>;
}
