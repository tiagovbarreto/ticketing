import { OrderCreatedListener } from "../order-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCreatedEvent, OrderStatus } from "@braves-corp/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent["data"] = {
    id: Types.ObjectId().toHexString(),
    status: OrderStatus.CREATED,
    expiresAt: "any",
    userId: "any",
    ticket: {
      id: "any",
      price: 10,
    },
    version: 0,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("When receiving an order created event", () => {
  it("Should replicates the order info.", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);

    expect(order!.price).toBe(data.ticket.price);
  });

  it("Should acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
