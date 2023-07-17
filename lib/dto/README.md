# @ddd-framework/dto

> `@ddd-framework/dto` is a package within the comprehensive `@ddd-framework` framework. It provides a type alias for Data Transfer Objects (DTOs) to facilitate data-centric operations and object/class initializers.

## Description

The `@ddd-framework/dto` package extends the functionality of the `@ddd-framework` by offering a type alias, `DataTransferObject<T>`, that allows developers to deeply convert a generic type into an anemic type. This is particularly useful for working with Data Transfer Objects (DTOs) in a DDD context within Node.js applications.

## Documentation

For more detailed information on `@ddd-framework/dto`, including usage examples and API reference, please refer to the [official documentation](https://rmolinamir.github.io/ddd-framework/modules/dto.html).

## Installation

To install `@ddd-framework/dto`, ensure you have the following prerequisites:

- Node.js stable version
- [pnpm](https://pnpm.io/)

Once the prerequisites are installed, run the following command:

```shell
$ pnpm i @ddd-framework/dto
...
```

This will install the `@ddd-framework/dto` package and its dependencies.

## Type Alias

### DataTransferObject\<T>

The `DataTransferObject<T>` type alias allows for the deep conversion of a generic type into an anemic type. It excludes any methods and focuses on data-centric operations or object/class initializers. This type alias is particularly useful for working with Data Transfer Objects (DTOs).

```typescript
type DataTransferObject<T> = T extends FunctionType
  ? never
  : Extract<T, undefined> extends never
  ? Serialize<T>
  : Serialize<T> | undefined;
```

By utilizing the `DataTransferObject<T>` type alias from the `@ddd-framework/dto` package, developers can effectively work with DTOs in a data-centric manner, simplifying object/class initialization and data operations.

## Usage

To use `@ddd-framework/dto`, import the `DataTransferObject` type alias from the package. For example:

```typescript
import { DataTransferObject } from '@ddd-framework/dto';

interface User {
  id: string;
  name: string;
  email: string;
}

// Usage example
const user: DataTransferObject<User> = {
  id: '123',
  name: 'John Doe',
  email: 'john.doe@example.com',
};

console.log(user); // Output: { id: '123', name: 'John Doe', email: 'john.doe@example.com' }
```

```typescript
import { DataTransferObject } from '@ddd-framework/dto';

const money = new Money(10, new CurrencyDetails('USD', '$', 2, true));
const dto = serialize(money);
expect(dto.amount as number).toBeTruthy();
expect(dto.currency.currencyCode as string).toBeTruthy();
```

```typescript
import { DataTransferObject } from '@ddd-framework/dto';

const order = new Order({
  id: new OrderId(faker.string.uuid()),
  status: 'PROCESSING',
  createdAt: DateValue.now(),
  updatedAt: DateValue.null
});

const dto = serialize(order);

order.id as DomainPrimitive<string>;
expect(dto.id as string).toBeTruthy();

order.status as string;
expect(dto.status as string).toBeTruthy();

order.createdAt as DateValue;
expect(dto.createdAt as string).toBeTruthy();

order.updatedAt as DateValue | undefined;
expect(dto.updatedAt as string | undefined).toBeTruthy();
```

By utilizing the `DataTransferObject` type alias from the `@ddd-framework/dto` package, developers can deeply convert a generic type into an anemic type, facilitating the use of DTOs in their Node.js applications.

## License

`@ddd-framework/dto` is released under the MIT License. Feel free to customize it further to fit your needs.
