#!/usr/bin/env node

/**
 * > Please make sure that your file(s) referenced in bin starts with #!/usr/bin/env node.
 * > Otherwise the scripts are started without the node executable!
 * [npm bin](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#bin)
 */

import { program } from './program';

program.parse();
