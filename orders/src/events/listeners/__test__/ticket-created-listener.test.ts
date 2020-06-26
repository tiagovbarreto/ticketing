import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@braves-corp/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data object
  const data: TicketCreatedEvent["data"] = {
    id: Types.ObjectId().toHexString(),
    version: 0,
    title: "Consert",
    price: 15,
    userId: Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

describe("When receiving a create ticket event", () => {
  it("Should creates and saves a ticket", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toBe(data.title);
    expect(ticket!.price).toBe(data.price);
  });

  it("Should acks the messag", async () => {
    const { listener, data, msg } = await setup();

    // Call onMessage function with the data object + message object
    await listener.onMessage(data, msg);

    // Write assertions to make sure a ticket was created
    await Ticket.findById(data.id);
    expect(msg.ack).toHaveBeenCalled();
  });
});
