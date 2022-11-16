import {
  DomainEvent,
  IdentifiedDomainObject,
  Identity,
  Repository
} from '@ddd-framework/core';

/**
 * Read Model Projections can be realized through a simple set of Domain Event
 * subscribers that are used to generate and update a persistent Read Model.
 */
export default abstract class Projection<
  ProjectedEvent extends DomainEvent = DomainEvent,
  View extends IdentifiedDomainObject<Identity> = IdentifiedDomainObject<Identity>
> {
  protected abstract repository: Repository<View>;

  /**
   * Apply the event into the Read Model Projection by transforming the data.
   */
  public async project(anEvent: ProjectedEvent): Promise<void> {
    return await this.when(anEvent);
  }

  /**
   * When an Event happens, transform the data.
   */
  protected abstract when(anEvent: ProjectedEvent): Promise<void>;
}
