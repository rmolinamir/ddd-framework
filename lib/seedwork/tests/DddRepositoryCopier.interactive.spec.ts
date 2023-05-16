import fs from 'fs-extra';
import path from 'path';

import { DddRepositoryCopier } from '../src/DddRepositoryCopier';

const TIME_TO_COMPLETE_IN_MS = 25000;
const TIME_TO_TIMEOUT_IN_MS = 900000;

describe('DddRepositoryCopier interactive', () => {
  test(
    'copies',
    async () => {
      const outputDirectory = path.resolve(__dirname, 'tmp');

      if (!fs.existsSync(outputDirectory)) fs.mkdirSync(outputDirectory);

      let timeoutId: NodeJS.Timeout | undefined;

      const timeout = new Promise((resolve) => {
        timeoutId = setTimeout(resolve, TIME_TO_COMPLETE_IN_MS);
      });

      const promise = DddRepositoryCopier.copy(outputDirectory);

      await Promise.race([promise, timeout]);

      if (timeoutId) clearTimeout(timeoutId);
    },
    TIME_TO_TIMEOUT_IN_MS
  );
});
