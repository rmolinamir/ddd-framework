import os from 'os';
import path from 'path';

export default function getDddPackagesTmpDir(): string {
  return path.join(os.tmpdir(), '@ddd-framework');
}
