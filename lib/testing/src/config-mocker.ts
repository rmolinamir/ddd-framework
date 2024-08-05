import assert from 'assert';
import fs, { existsSync } from 'fs';
import os from 'os';
import path from 'path';

type ClassType = new (...args: unknown[]) => unknown;
type Uri = { value: string; path: string };

export class ConfigMocker {
  private files = new Map<ClassType, Uri>();

  constructor(private readonly location: string = os.tmpdir()) {
    assert(existsSync(this.location), 'Location does not exist.');
  }

  public add<C extends ClassType>(Config: C, data: InstanceType<C>): Uri {
    const file = path
      .resolve(this.location, `${Config.name}.json`)
      .replace(/\\/g, '/');

    fs.writeFileSync(file, JSON.stringify(data));

    const uri: Uri = {
      value: `file://${file}`,
      path: file
    };

    this.files.set(Config, uri);

    return uri;
  }

  public cleanup(): void {
    for (const { path } of this.files.values()) {
      try {
        fs.unlinkSync(path);
      } catch (err) {
        console.warn(`Could not delete file {${path}}: `, err);
      }
    }

    this.files.clear();
  }
}
