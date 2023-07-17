import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import { enquireYesToEverything } from './mocks';

describe('cli', () => {
  // This is just a string mocking the script that would be executed.
  const PLACEHOLDER_CLI_FILE = 'cli.js';

  beforeEach(() => {
    enquireYesToEverything();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('generates seedwork', async () => {
    const { program } = await import('../program');
    const { isEmptyDir } = await import('../helpers');

    const outputDir = path.join(os.tmpdir(), Date.now().toString());

    fs.ensureDirSync(outputDir);

    fs.emptyDir(outputDir);

    await program.parseAsync(['node', PLACEHOLDER_CLI_FILE, outputDir]);

    await expect(isEmptyDir(outputDir)).resolves.toBe(false);

    fs.emptyDir(outputDir);
  });
});
