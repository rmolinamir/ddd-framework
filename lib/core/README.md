# @ddd-framework/core

> `@ddd-framework/core` is a package within the comprehensive `@ddd-framework` framework. It provides essential functionalities and classes for implementing Domain-Driven Design (DDD) specifically for Node.js.

## Introduction

The `@ddd-framework/core` package is a fundamental component of the `@ddd-framework`. It offers a range of features and tools that are crucial for incorporating DDD principles into Node.js applications. This package plays a significant role in streamlining the development process, improving code organization, and creating robust and maintainable applications based on DDD principles.

## Documentation

For more detailed TypeDoc-generated documentation on `@ddd-framework/core`, please refer to the [official documentation](https://www.example.com).

## Installation

To install `@ddd-framework/core`, ensure you have the following prerequisites:

- Node.js stable version
- [pnpm](https://pnpm.io/)

Once the prerequisites are installed, run the following command:

```shell
$ pnpm i @ddd-framework/core
...
```

This will install the `@ddd-framework/core` package and its dependencies.

## Features

The `@ddd-framework/core` package offers a set of features that align with the principles of Domain-Driven Design (DDD) to facilitate the development of Node.js applications:

- **Aggregates and Entities**: Provides decorators and classes such as `AggregateRoot` and `Entity` to model and manage domain aggregates and entities. These classes encapsulate behavior, enforce business rules, and enable consistency within the domain model.
- **Domain Events**: Offers the `DomainEvent` decorator to represent and handle domain events. Domain events are used to capture meaningful occurrences within the domain and allow decoupled communication between different parts of the application.
- **Value Objects**: Includes the `ValueObject` class to define immutable value objects. Value objects encapsulate small, cohesive pieces of data with their own rules and behaviors, contributing to the integrity and expressiveness of the domain model.
- **Domain Primitives**: Provides domain primitive classes such as `DateValue` that encapsulate specific domain concepts and ensure type safety and consistency within the domain model.
- **Repositories**: Provides the `Repository` class, which serves as an abstraction to access and persist aggregates and entities in a domain-agnostic manner. Repositories enable a consistent and standardized way to retrieve and store domain objects.
- **Unit of Work**: Offers the `UnitOfWork` and `UnitOfWorkManager` classes to implement the Unit of Work pattern. These classes provide a way to manage the transactional consistency and coordination of changes across multiple aggregates or entities within a single operation.
- **Exception Handling**: Provides a range of exception classes, including `ArgumentException`, `InvalidOperationException`, and more, to handle exceptional situations and errors that can occur during domain operations.

By leveraging these features from the `@ddd-framework/core` package, developers can effectively implement DDD concepts such as aggregates, entities, domain events, and repositories in their Node.js applications, leading to more maintainable, expressive, and domain-focused code.

## Usage

To use `@ddd-framework/core`, import the desired classes, interfaces, or functions from the package. For example:

```typescript
import {
  AggregateId,
  AggregateRoot,
  Entity,
  EntityId,
  IllegalStateException
} from '@ddd-framework/core';
import { faker } from '@faker-js/faker';

@AggregateRoot()
export class GiftCard extends Entity {
  @AggregateId()
  public id: string;

  public remainingValue: number;

  public transactions: GiftCardTransaction[] = [];

  constructor(id: string, initialBalance: number) {
    super();
    this.id = id;
    this.remainingValue = initialBalance;
  }

  @Entity.Invariant()
  public handle(cmd: TransactCommand | ReimburseCardCommand) {
    if (cmd instanceof TransactCommand) {
      const transaction = new GiftCardTransaction(
        faker.string.uuid(),
        cmd.transactionValue
      );

      this.remainingValue -= transaction.transactionValue;

      this.transactions.push(transaction);

      this.raise(
        new TransactionEvent(
          this.id,
          transaction.transactionId,
          transaction.transactionValue
        )
      );
    } else if (cmd instanceof ReimburseCardCommand) {
      const transaction = this.transactions.find(
        (i) => i.transactionId === cmd.transactionId
      );

      if (transaction) {
        this.remainingValue += transaction.transactionValue;
        transaction.handle(cmd);
      }
    }
  }

  protected validateInvariants(): void {
    if (this.remainingValue < 0)
      throw new IllegalStateException('Gift card cannot be overdrawn');
  }
}
```

## License

`@ddd-framework/core` is released under the MIT License. Feel free to customize it further to fit your needs.
