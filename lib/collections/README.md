# @ddd-framework/collections

> `@ddd-framework/collections` is a package within the comprehensive `@ddd-framework` framework. It provides classes for managing collections in a Domain-Driven Design (DDD) context specifically for Node.js.

## Description

The `@ddd-framework/collections` package extends the functionality of the `@ddd-framework` by offering additional classes related to collections. These utilities facilitate the management and manipulation of collections in a DDD-oriented manner within Node.js applications.

## Documentation

For more detailed information on `@ddd-framework/collections`, including usage examples and API reference, please refer to the [official documentation](https://www.example.com).

## Installation

To install `@ddd-framework/collections`, ensure you have the following prerequisites:

- Node.js stable version
- [pnpm](https://pnpm.io/)

Once the prerequisites are installed, run the following command:

```shell
$ pnpm i @ddd-framework/collections
...
```

This will install the `@ddd-framework/collections` package and its dependencies.

## Features

The `@ddd-framework/collections` package provides the following features:

- **EntityCollection**: The `EntityCollection` class represents a collection of entities in the domain model. It provides convenient methods for managing and accessing entities within the collection.
- **List**: The `List` class is an immutable ordered collection that allows storing and manipulating elements. It provides various operations such as adding, removing, retrieving elements from the list, and more.

By utilizing these features from the `@ddd-framework/collections` package, developers can effectively manage collections of entities and lists within their Node.js applications following DDD principles.

## Usage

To use `@ddd-framework/core`, import the desired classes, interfaces, or functions from the package. For example:

```typescript
import {
  Entity,
  EntityCollection,
  EntityId,
  Identity,
  IllegalStateException
} from '@ddd-framework/core';

class UserId extends Identity {
  protected validate(): void {
    if (!this.value) throw new IllegalStateException('id is required');
  }
}

class User extends Entity {
  @EntityId()
  public id: UserId;

  constructor(id: UserId) {
    super();
    this.id = id;
  }
}

const user = new User(new UserId(faker.string.uuid()));

const collection = new EntityCollection<User>();

expect(collection.add(user).contains(user)).toBeTruthy();
```

## License

`@ddd-framework/collections` is released under the MIT License. Feel free to customize it further to fit your needs.
