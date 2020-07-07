import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledEvent, OrderStatus } from "@braves-corp/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/order";

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    price: 10,
    status: OrderStatus.CREATED,
    userId: "any",
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent["data"] = {
    id: order!.id,
    ticket: {
      id: "any",
    },
    version: 1,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, data, msg };
};

describe("When receiving an order cancelled event", () => {
  it("Should update the order status to cancelled.", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);
    const order = await Order.findById(data.id);

    expect(order!.status).toBe(OrderStatus.CANCELLED);
  });

  it("Should acks the message", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
