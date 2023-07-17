# @ddd-framework/uuid

> `@ddd-framework/uuid` is a package within the comprehensive `@ddd-framework` framework. It provides a class for working with Universally Unique Identifiers (UUIDs) following the RFC4122 standard.

## Description

The `@ddd-framework/uuid` package is an essential component of the `@ddd-framework`. It offers a class, Uuid, that allows developers to work with Universally Unique Identifiers (UUIDs) in a DDD context within Node.js applications. This package provides convenient methods for generating, manipulating, and comparing UUIDs, adhering to the RFC4122 standard.

## Documentation

For more detailed information on `@ddd-framework/uuid`, including usage examples and API reference, please refer to the [official documentation](https://rmolinamir.github.io/ddd-framework/modules/uuid.html).

## Installation

To install `@ddd-framework/uuid`, ensure you have the following prerequisites:

- Node.js stable version
- [pnpm](https://pnpm.io/)

Once the prerequisites are installed, run the following command:

```shell
$ pnpm i @ddd-framework/uuid
...
```

This will install the `@ddd-framework/uuid` package and its dependencies.

## Features

The `@ddd-framework/uuid` package provides the following features:

- **UUID Generation**: Allows generating Universally Unique Identifiers (UUIDs) following the RFC4122 standard.
- **UUID Manipulation**: Provides methods for manipulating UUIDs, including conversion to primitive string representation, checking equality between UUID instances, and retrieving the raw value of a UUID.
- **RFC4122 Compliance**: Ensures adherence to the RFC4122 standard for UUIDs, guaranteeing compatibility and interoperability with other systems.
By utilizing the features of the @ddd-framework/uuid package, developers can easily generate, manipulate, and compare Universally Unique Identifiers (UUIDs) within their Node.js applications, following the RFC4122 standard.

By utilizing the features of the `@ddd-framework/uuid` package, developers can easily generate, manipulate, and compare Universally Unique Identifiers (UUIDs) within their Node.js applications, following the RFC4122 standard.

## Usage

To use `@ddd-framework/uuid`, import the `Uuid` class from the package. For example:

```typescript
import { Uuid } from '@ddd-framework/uuid';

// Generate a new UUID
console.log(Uuid.generate()); // Output: e6fd1f80-7236-4ce2-8a25-18445a60af84

// Create a UUID instance from a string value
const uuid = new Uuid(Uuid.generate());

// Unpack the UUID instance to a string value
const primitiveValue = uuid.unpack();
console.log(primitiveValue); // Output: e6fd1f80-7236-4ce2-8a25-18445a60af84

// Check if two UUID instances are equal
const anotherUuid = new Uuid('e6fd1f80-7236-4ce2-8a25-18445a60af84');
console.log(uuid.equals(anotherUuid)); // Output: true
```

## License

`@ddd-framework/uuid` is released under the MIT License. Feel free to customize it further to fit your needs.
