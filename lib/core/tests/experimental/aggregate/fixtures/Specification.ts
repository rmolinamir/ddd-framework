import { AggregateMember } from '../../../../src/experimental/decorators/aggregate/member';
import Entity from '../../../../src/experimental/decorators/Entity';
import EntityCollection from '../../../../src/experimental/decorators/EntityCollection';
import EntityId from '../../../../src/experimental/decorators/EntityId';
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
