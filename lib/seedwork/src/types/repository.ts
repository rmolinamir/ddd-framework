import { Version } from './version';

export type Repository = {
  author: string;
  name: string;
  versions: Version[];
};
