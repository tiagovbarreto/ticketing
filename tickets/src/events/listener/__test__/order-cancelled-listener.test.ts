import { OrderCancelledListener } from "../order-cancelled-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { OrderCancelledEvent, OrderStatus } from "@braves-corp/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  //Create an instance of the listener
  const listener = new OrderCancelledListener(natsWrapper.client);

  //Create and save the ticket
  const orderId = Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "concert",
    price: 10,
    userId: "123",
  });
  ticket.set({ orderId });
  await ticket.save();

  //Create the fake data event
  const data: OrderCancelledEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, orderId, data, msg };
};

describe("When receiving an event of order cancellation", () => {
  it("Should set the orderId of the ticket", async () => {
    const { listener, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
  });

  it("Should ack message.", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
  });

  it("Should publish a ticket updated event", async () => {
    const { listener, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    //@ts-ignore
    //console.log(natsWrapper.client.publish.mock.calls[0][1]);
    const ticketUpdated = JSON.parse(
      (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
    );
    expect(ticketUpdated.orderId).toBe(undefined);
  });
});
