import { ExpirationCompletedListener } from "../../listeners/expiration-completed-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Types } from "mongoose";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompletedEvent } from "@braves-corp/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: "Ballet Concert",
    price: 50,
  });
  await ticket.save();

  const order = Order.build({
    userId: "asdfsdf",
    status: OrderStatus.CREATED,
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompletedEvent["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, order, data, msg };
};

describe("When receiving an expiration completed event", () => {
  it("Should update successfuly the order", async () => {
    const { listener, data, msg, order } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toBe(OrderStatus.CANCELLED);
  });

  it("Should emit an order cancelled event", async () => {
    const { listener, order, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const eventData = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );

    expect(eventData.id).toBe(order.id);
  });

  it("Should acks the message", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
  });
});
