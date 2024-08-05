import { UnitOfWork } from './unit-of-work';

// TODO:
// Add an `AggregateCreationPolicy`.
// [Using Axon as an example](https://docs.axoniq.io/reference-guide/axon-framework/axon-framework-commands/command-handlers#aggregate-command-handler-creation-policy):
// > - `ALWAYS` - A creation policy of "always" will expect to instantiate the aggregate. This effectively works like a command handler annotated constructor. Without defining a return type, the aggregate identifier used during the creation will be returned. Through this approach, it is possible to return other results next to the aggregate identifier.
// > - `CREATE_IF_MISSING` - A creation policy of "create if missing" can either create an aggregate or act on an existing instance.
// > This policy should be regarded as a create or update approach of an aggregate.
// > - `NEVER` - A creation policy of "never" will be handled on an existing aggregate instance.
// > This effectively works like any regular command handler annotated method.

/**
 * Persistence oriented repository that provides an abstraction layer between the domain and data mapping layers.
 * Acts like an in-memory domain object collection.
 */
export abstract class Repository<Entity, Identity> {
  public abstract getById(anIdentity: Identity): Promise<Entity | null>;

  public abstract save(
    anObject: Entity,
    aUnitOfWork?: UnitOfWork
  ): Promise<Entity>;

  public abstract delete(
    anObject: Entity,
    aUnitOfWork?: UnitOfWork
  ): Promise<Entity>;
}
