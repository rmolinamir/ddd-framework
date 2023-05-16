import { AggregateMember } from '../../../../src/__experimental__/decorators/aggregate/member';
import Entity from '../../../../src/__experimental__/decorators/Entity';
import EntityCollection from '../../../../src/__experimental__/decorators/EntityCollection';
import EntityId from '../../../../src/__experimental__/decorators/EntityId';
import { Choice } from './Choice';
import { SpecificationId } from './SpecificationId';

export class Specification extends Entity {
  @EntityId()
  public id: SpecificationId;

  @AggregateMember()
  public choices: EntityCollection<Choice>;

  constructor(
    id: SpecificationId,
    public name: string,
    choices: EntityCollection<Choice>
  ) {
    super();
    this.id = id;
    this.choices = choices;
  }
}
