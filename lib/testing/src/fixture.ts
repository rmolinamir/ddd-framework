import { DataTransferObject } from '@ddd-framework/dto';
import { DeepPartial } from './deep-partial';

export interface Fixture<Output, Input = DataTransferObject<Output>> {
  (overrides?: DeepPartial<Input> | undefined): Output;
}
