declare module 'check-dependencies' {
  type Config = {
    /**
     * Package manager to check against. Possible values: 'npm', 'bower'.
     * NOTE: for bower you need to have the bower package installed either globally or locally in the same project in which you use check-dependencies.
     * @default 'npm'
     */
    packageManager?: 'npm' | 'bower';
    /**
     * Path to the directory containing package.json or bower.json.
     * @default // The closest directory containing `package.json` or `bower.json` (depending on packageManager specified) when going up the tree, starting from the current one.
     */
    packageDir?: string;
    /**
     * Ensures all installed dependencies are specified in package.json or bower.json.
     * NOTE: Don't use this option with npm 3.0.0 or newer as it deduplicates the file dependency tree by default so check-dependencies will think many modules are excessive whereas in fact they will not.
     * @default false
     */
    onlySpecified?: boolean;
    /**
     * Installs packages if they don't match. With the onlySpecified option enabled prune excessive packages as well.
     * @default false
     */
    install?: boolean;
    /**
     * The list of keys in package.json or bower.json where to look for package names & versions.
     * @default ['dependencies', 'devDependencies']
     */
    scopeList?: string[];
    /**
     * The list of keys in package.json or bower.json where to look for optional package names & versions. An optional package is not required to be installed but if it's installed, it's supposed to match the specified version range.
     * @default ['optionalDependencies']
     */
    optionalScopeList?: string[];
    /**
     * By default, check-dependencies will skip version check for custom package names, but will still check to see if they are installed. For example:
     * ```json
     *    "dependencies": {
     *       "specialSemver059": "semver#0.5.9"
     *    }
     * ```
     * If checkCustomPackageNames is enabled, check-dependencies will parse the version number (after the hash) for custom package names and check it against the version of the installed package of the same name.
     * @default false
     */
    checkCustomPackageNames?: boolean;
    /**
     * By default, check-dependencies will skip version check for packages whose version contains the full repository path. For example:
     * ```json
     *    "dependencies": {
     *       "semver": "https://github.com/npm/node-semver.git#0.5.9"
     *    }
     * ```
     * If checkGitUrls is enabled, check-dependencies will parse the version number (after the path to the git repository and the hash) and check it against the version of the installed package.
     * @default false
     */
    checkGitUrls?: boolean;
    /**
     * Prints messages to the console.
     * @default false
     */
    verbose?: boolean;
    /**
     * A function logging debug messages (applies only if verbose: true).
     * @default console.log.bind(console)
     */
    log?: (...args: unknown[]) => void;
    /**
     * A function logging error messages (applies only if verbose: true).
     * @default console.error.bind(console)
     */
    error?: (...args: unknown[]) => void;
  };

  type Output = {
    status: number; // 0 if successful, 1 otherwise
    depsWereOk: boolean; // true if dependencies were already satisfied
    log: string[]; // array of logged messages
    error: string[]; // array of logged errors
  };

  interface CheckDependencies {
    (config: Config, callback: (output: Output) => void): void;
    (config: Config): Promise<Output>;
    sync(config: Config): Output;
  }

  const checkDependencies: CheckDependencies;

  export default checkDependencies;
}
