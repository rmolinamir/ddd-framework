# @ddd-framework

> `@ddd-framework` is a comprehensive framework designed to facilitate the implementation of Domain-Driven Design (DDD) specifically for Node.js.

## Introduction

This framework consists of a collection of packages that serve different purposes in order to support DDD practices effectively. These packages provide essential functionalities and tools that enable developers to seamlessly incorporate DDD principles into their Node.js applications. By leveraging `@ddd-framework`, developers can streamline their development process, enhance code organization, and create robust and maintainable applications based on the principles of DDD. It contains the following packages:

- [@ddd-framework/collections](https://rmolinamir.github.io/ddd-framework/modules/core.html)
- [@ddd-framework/core](https://rmolinamir.github.io/ddd-framework/modules/core.html)
- [@ddd-framework/dto](https://rmolinamir.github.io/ddd-framework/modules/core.html)
- [@ddd-framework/mongodb](https://rmolinamir.github.io/ddd-framework/modules/mongodb.html)
- [@ddd-framework/postgres](https://rmolinamir.github.io/ddd-framework/modules/postgres.html)
- [@ddd-framework/seedwork](https://rmolinamir.github.io/ddd-framework/modules/core.html)
- [@ddd-framework/uuid](https://rmolinamir.github.io/ddd-framework/modules/core.html)

## Documentation

To access comprehensive TypeDoc-generated documentation for `@ddd-framework`, please refer to the [official documentation](https://rmolinamir.github.io/ddd-framework/index.html).

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

 Tasks:    4 successful, 4 total
Cached:    0 cached, 4 total
  Time:    3.571s 
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

## License

The `@ddd-framework` is released under the MIT License. Feel free to customize it further to fit your needs.
