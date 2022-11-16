import { IdentifiedDomainObject, Identity } from '../common';
import UnitOfWork from './UnitOfWork';

/**
 * TODO:
 *
 * Add an `AggregateCreationPolicy`.
 *
 * [Using Axon as an example](https://docs.axoniq.io/reference-guide/axon-framework/axon-framework-commands/command-handlers#aggregate-command-handler-creation-policy):
 *
 * > - `ALWAYS` - A creation policy of "always" will expect to instantiate the aggregate. This effectively works like a command handler annotated constructor. Without defining a return type, the aggregate identifier used during the creation will be returned. Through this approach, it is possible to return other results next to the aggregate identifier.
 * > - `CREATE_IF_MISSING` - A creation policy of "create if missing" can either create an aggregate or act on an existing instance.
 * > This policy should be regarded as a create or update approach of an aggregate.
 * > - `NEVER` - A creation policy of "never" will be handled on an existing aggregate instance.
 * > This effectively works like any regular command handler annotated method.
 */

export default abstract class Repository<
  DomainObject extends IdentifiedDomainObject<Identity>
> {
  public abstract getBy(
    anIdentity: DomainObject['id']
  ): Promise<DomainObject | null>;

  public abstract save(
    anObject: DomainObject,
    aUnitOfWork?: UnitOfWork
  ): Promise<DomainObject>;

  public abstract delete(
    anObject: DomainObject,
    aUnitOfWork?: UnitOfWork
  ): Promise<DomainObject>;
}
