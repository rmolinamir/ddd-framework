import { AggregateRoot } from '../aggregates';
import { Identity } from '../common';
import { UnitOfWork } from '../repositories';
import { ObjectLiteral } from '../types';
import DomainEvent from './DomainEvent';

export default abstract class DomainEventPublisher {
  /**
   * Publishes a domain event to its subscribers.
   */
  public abstract publish<Event extends DomainEvent<ObjectLiteral | void>>(
    aDomainEvent: Event,
    aUnitOfWork?: UnitOfWork
  ): Promise<void>;

  /**
   * Publishes a domain event to its subscribers.
   */
  public abstract publish<Event extends DomainEvent<ObjectLiteral | void>>(
    domainEvents: Event[],
    aUnitOfWork?: UnitOfWork
  ): Promise<void>;

  /**
   * Publishes a domain event to its subscribers.
   */
  public abstract publish<Event extends DomainEvent<ObjectLiteral | void>>(
    anAggregateRoot: AggregateRoot<Identity, Event>,
    aUnitOfWork?: UnitOfWork
  ): Promise<void>;
}
