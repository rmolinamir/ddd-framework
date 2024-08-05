import { ClientSession } from 'mongodb';
import { UnitOfWork } from '@ddd-framework/core';

export class MongoDbUnitOfWork implements UnitOfWork {
  private isStarted = false;

  constructor(public session: ClientSession) {}

  /**
   * Starts a new UnitOfWork.
   */
  public async start(): Promise<void> {
    if (!this.isStarted) {
      this.session.startTransaction();
      this.isStarted = true;
    }
  }

  /**
   * Commits the currently active UnitOfWork, and ends this session on the server.
   */
  public async commit(): Promise<void> {
    await this.session.commitTransaction();

    await this.session.endSession();
  }

  /**
   * Aborts or rolls back the currently active UnitOfWork.
   */
  public async rollback(): Promise<void> {
    await this.session.abortTransaction();

    await this.session.endSession();
  }
}
