# Monorepo

## Getting Started

Requirements:

- A Node.js stable version
- [pnpm](https://pnpm.io/)

After installing the requirements, run:

```sh
$ pnpm i
...
Progress: resolved 667, reused 662, downloaded 0, added 0, done
```

This will allow correct linting and running unit tests.

### What's inside?

This monorepo uses [pnpm](https://pnpm.io/) as a package manager.

## Commands

Following are commands that can be executed at root level with the help of the `Turborepo` API. These commands are configured inside the `turbo.json` file and serve as the monorepo pipeline.

### `build`

To build all packages, run the following command:

```sh
$ pnpm build
...
@ddd-framework/seedwork:build: > tsc --project tsconfig.build.json
@ddd-framework/core:build: > tsc --project tsconfig.build.json
@ddd-framework/cqrs:build: > tsc --project tsconfig.build.json
@ddd-framework/event-sourcing:build: > tsc --project tsconfig.build.json
```

### `dev`

To optimally rebuild packages after code changes, run the following command:

```sh
$ pnpm dev
...
@ddd-framework/seedwork:build: > tsc --project tsconfig.build.json
@ddd-framework/seedwork:build: >
@ddd-framework/core:build: > tsc --project tsconfig.build.json
@ddd-framework/core:build: >
@ddd-framework/cqrs:build: > tsc --project tsconfig.build.json
@ddd-framework/cqrs:build: >
@ddd-framework/event-sourcing:build: > tsc --project tsconfig.build.json
@ddd-framework/event-sourcing:build: >
```

### `test`

To test all packages, run the following command:

```sh
$ pnpm test
...
 Tasks:    6 successful, 6 total
Cached:    4 cached, 6 total
  Time:    9.487s 
```
