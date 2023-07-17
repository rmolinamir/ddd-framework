# @ddd-framework/seedwork

> `@ddd-framework/seedwork` is a package within the comprehensive `@ddd-framework` framework. It provides a module generation tool that allows developers to generate a module with minimal functionality, which can be customized according to their specific needs.

## Description

Based on [[Seedwork, Fowler](https://martinfowler.com/bliki/Seedwork.html)], this package will generate a module containing minimal functionality of the `@ddd-framework`. But be warned, and to quote Fowler:

> Of course this means that there's no way for you to get common updates to the seedwork, once you grow it you own it. This is the kind of copy and paste reuse that many people, including me, deride.

The `@ddd-framework/seedwork` package is inspired by the concept of "Seedwork" as described by Martin Fowler. It provides a module generation tool that helps developers kickstart their projects by generating a module with minimal functionality from the `@ddd-framework`. The generated module serves as a starting point and can be modified and extended as per the project requirements.

## Documentation

For more detailed information on how to use the `@ddd-framework/seedwork` module generation tool, please refer to the [official documentation](https://www.example.com).

## Installation

To install `@ddd-framework/seedwork`, ensure you have the following prerequisites:

- Node.js stable version
- [pnpm](https://pnpm.io/)

Once the prerequisites are installed, run the following command:

```shell
$ pnpm i @ddd-framework/seedwork
...
```

This will install the `@ddd-framework/seedwork` package and its dependencies.

## Usage

To generate a module using `@ddd-framework/seedwork`, run the provided command or use the provided CLI tool. For example:

```shell
$ npx @ddd-framework/seedwork src/seedwork
✔ The output directory is not empty, would you like to continue? (y/N) · true
✔ Select which version of the @ddd-framework to copy: · v1
✔ These dependencies are not installed but are required by the seedwork: reflect-metadata, @types/uuid, uuid. Would you like to continue without them? (y/N) · true
✔ Select which packages to include in the seedwork (any @ddd-framework dependency will also be installed): · collections, core, dto, uuid
✔ Good luck using the seedwork. If there any issues, please report them at: 🔗 https://github.com/rmolinamir/ddd-framework/issues
```

This will generate a module named `seedwork` with minimal functionality, providing a foundation for building upon the `@ddd-framework`. You can then modify and extend this module to fit your specific project requirements.

## Seedwork Philosophy

The concept of "Seedwork" involves copying and pasting a minimal set of code as a starting point for a project. It is important to note that once you generate the seedwork module and customize it, you are responsible for maintaining and updating it. Any updates or enhancements to the seedwork will need to be manually incorporated into your customized module.

While copy-paste reuse is often discouraged in favor of more modular and maintainable approaches, seedwork can provide a quick starting point for your project. However, it is essential to actively manage and evolve your customized module over time to ensure it stays aligned with the evolving needs of your application.

## License

`@ddd-framework/seedwork` is released under the MIT License. Feel free to customize it further to fit your needs.
