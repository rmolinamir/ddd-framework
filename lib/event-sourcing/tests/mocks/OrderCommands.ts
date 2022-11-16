import { Command } from '@ddd-framework/cqrs';
import Address from './Address';
import OrderLine from './OrderLine';
import OrderLineId from './OrderLineId';

export class CreateOrder extends Command {}

export class RestartOrder extends Command {}

export class AddOrderLine extends Command<OrderLine> {}

export class RemoveOrderLine extends Command<OrderLineId> {}

export class SetShippingAddress extends Command<Address> {}

export class SetBillingAddress extends Command<Address> {}

export class PlaceOrder extends Command {}

export class ShipOrder extends Command {}

export class DeliverOrder extends Command {}

export class MarkOrderAsDelivered extends Command {}
