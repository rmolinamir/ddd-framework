import { AggregateMember } from '../../../../src/__experimental__/decorators/aggregate/member';
import { AggregateRoot } from '../../../../src/__experimental__/decorators/aggregate/root';
import Entity from '../../../../src/__experimental__/decorators/Entity';
import EntityCollection from '../../../../src/__experimental__/decorators/EntityCollection';
import EntityId from '../../../../src/__experimental__/decorators/EntityId';
import { ServiceId } from './ServiceId';
import { Specification } from './Specification';

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
