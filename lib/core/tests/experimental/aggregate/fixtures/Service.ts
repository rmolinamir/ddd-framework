import Entity from '../../../../src/experimental/decorators/Entity';
import EntityCollection from '../../../../src/experimental/decorators/EntityCollection';
import EntityId from '../../../../src/experimental/decorators/EntityId';
import { AggregateRoot } from '../../../../src/experimental/decorators/aggregate/root';
import { AggregateMember } from '../../../../src/experimental/decorators/aggregate/member';
import { Specification } from './Specification';
import { ServiceId } from './ServiceId';

@AggregateRoot()
export class Service extends Entity {
  @EntityId()
  public serviceId: ServiceId;

  public views = 0;

  @AggregateMember()
  public specifications: EntityCollection<Specification>;

  constructor(
    serviceId: ServiceId,
    specifications: EntityCollection<Specification>
  ) {
    super();
    this.serviceId = serviceId;
    this.specifications = specifications;
  }

  public watch() {
    this.views += 1;
  }
}
