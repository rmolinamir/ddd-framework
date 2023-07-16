import { DomainEvent } from '@ddd-framework/core';

export class OrderCreated extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderCreated';
  public static readonly eventVersion = '0';
}

export class OrderReset extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderReset';
  public static readonly eventVersion = '0';
}

export class OrderLineAdded extends DomainEvent<{
  readonly orderId: string;
  readonly orderLineId: string;
  readonly orderLineProductId: string;
}> {
  public static readonly eventType = 'OrderLineAdded';
  public static readonly eventVersion = '0';
}

export class OrderLineRemoved extends DomainEvent<{
  readonly orderId: string;
  readonly orderLineId: string;
}> {
  public static readonly eventType = 'OrderLineRemoved';
  public static readonly eventVersion = '0';
}

export class ShippingAddressSet extends DomainEvent<{
  readonly orderId: string;
  readonly country: string;
  readonly city: string;
  readonly street: string;
  readonly zipCode: string;
}> {
  public static readonly eventType = 'ShippingAddressSet';
  public static readonly eventVersion = '0';
}

export class BillingAddressSet extends DomainEvent<{
  readonly orderId: string;
  readonly country: string;
  readonly city: string;
  readonly street: string;
  readonly zipCode: string;
}> {
  public static readonly eventType = 'BillingAddressSet';
  public static readonly eventVersion = '0';
}

export class OrderPlaced extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderPlaced';
  public static readonly eventVersion = '0';
}

export class OrderShipped extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderShipped';
  public static readonly eventVersion = '0';
}

export class OrderSentForDelivery extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderSentForDelivery';
  public static readonly eventVersion = '0';
}

export class OrderDelivered extends DomainEvent<{
  readonly orderId: string;
}> {
  public static readonly eventType = 'OrderDelivered';
  public static readonly eventVersion = '0';
}

export type OrderEvents =
  | OrderCreated
  | OrderReset
  | OrderLineAdded
  | OrderLineRemoved
  | ShippingAddressSet
  | BillingAddressSet
  | OrderPlaced
  | OrderShipped
  | OrderSentForDelivery
  | OrderDelivered;
