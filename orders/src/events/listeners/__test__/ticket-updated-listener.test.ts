import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedEvent } from "@braves-corp/common";
import { Types } from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // Create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: "Ballet Concert",
    price: 50,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "Rock Consert",
    price: 10,
    userId: Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg, ticket };
};

it("Should update successfuly a ticket", async () => {
  const { listener, data, msg, ticket } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toBe(data.title);
  expect(updatedTicket!.price).toBe(data.price);
  expect(updatedTicket!.version).toBe(data.version);
});

it("Should acks the messag", async () => {
  const { listener, data, msg } = await setup();

  // Call onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created
  await Ticket.findById(data.id);
  expect(msg.ack).toHaveBeenCalled();
});

it("Should not call ack if the event has a skipped version number", async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  await expect(listener.onMessage(data, msg)).rejects.toThrow();
  expect(msg.ack).not.toHaveBeenCalled();
});
