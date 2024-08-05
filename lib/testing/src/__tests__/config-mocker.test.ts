import { existsSync, readFileSync } from 'fs';
import os from 'os';
import { afterEach, describe, expect, test } from 'vitest';
import { ConfigMocker } from '../config-mocker';

describe('ConfigMocker', () => {
  const tmpDir = os.tmpdir();
  const mocker = new ConfigMocker(tmpDir);

  afterEach(() => {
    mocker.cleanup();
  });

  test('should add config', () => {
    class Config {}
    const data = { a: 1, b: 2 };

    const uri = mocker.add(Config, data);

    expect(uri).toEqual({
      value: `file://${uri.path}`,
      path: uri.path
    });
    expect(uri.path).toBe(`${tmpDir}/${Config.name}.json`);
  });

  test('writes file', () => {
    const data = { a: 1, b: 2 };
    const uri = mocker.add(class Config {}, data);
    expect(readFileSync(uri.path, 'utf8')).toEqual(JSON.stringify(data));
  });

  test('should cleanup', () => {
    const data = { a: 1, b: 2 };
    const uri = mocker.add(class Config {}, data);
    expect(existsSync(uri.path)).toBe(true);
    mocker.cleanup();
    expect(existsSync(uri.path)).toBe(false);
  });
});
