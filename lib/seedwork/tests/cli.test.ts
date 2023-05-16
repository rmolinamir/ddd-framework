import fs from 'fs-extra';
import os from 'os';
import path from 'path';

import enquireYesToEverything from './mocks/enquireYesToEverything';

describe('@ddd-framework/seedwork cli', () => {
  // This is just a string mocking the script that would be executed.
  const PLACEHOLDER_CLI_FILE = 'cli.js';

  beforeEach(() => {
    enquireYesToEverything();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('generates seedwork', async () => {
    const { program } = await import('../src/program');
    const { default: isEmptyDir } = await import('../src/helpers/isEmptyDir');

    const outputDir = path.join(os.tmpdir(), Date.now().toString());

    fs.ensureDirSync(outputDir);

    fs.emptyDir(outputDir);

    await program.parseAsync(['node', PLACEHOLDER_CLI_FILE, outputDir]);

    await expect(isEmptyDir(outputDir)).resolves.toBe(false);

    fs.emptyDir(outputDir);
  });
});
