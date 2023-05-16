import Entity from '../../../../src/__experimental__/decorators/Entity';
import EntityId from '../../../../src/__experimental__/decorators/EntityId';
import { ChoiceId } from './ChoiceId';

export class Choice extends Entity {
  @EntityId()
  public id: ChoiceId;

  constructor(id: ChoiceId, public name: string) {
    super();
    this.id = id;
  }
}
