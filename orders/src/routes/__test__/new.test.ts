import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { Order, OrderStatus } from "../../models/order";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("When add new order", () => {
  const url = "/api/orders";
  const ticketId = Types.ObjectId();

  it("Should return an error if the ticket does not exist", async () => {
    const res = await request(app)
      .post(url)
      .set("Cookie", await global.signin())
      .send({ ticketId });
    expect(res.status).toBe(404);
  });

  it("Should return an error if the ticket is already reserved", async () => {
    const ticket = Ticket.build({
      id: Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    const order = Order.build({
      userId: "abc",
      status: OrderStatus.CREATED,
      expiresAt: new Date(),
      ticket,
    });
    await order.save();

    const res = await request(app)
      .post(url)
      .set("Cookie", await global.signin())
      .send({
        ticketId: ticket.id,
      });

    expect(res.status).toBe(400);
  });

  it("Should successulfuly reserve a ticket", async () => {
    const ticket = Ticket.build({
      id: Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    const res = await request(app)
      .post(url)
      .set("Cookie", await global.signin())
      .send({
        ticketId: ticket.id,
      });

    expect(res.status).toBe(201);
  });

  it("Should emits an order created event", async () => {
    const ticket = Ticket.build({
      id: Types.ObjectId().toHexString(),
      title: "concert",
      price: 20,
    });
    await ticket.save();

    const res = await request(app)
      .post(url)
      .set("Cookie", await global.signin())
      .send({
        ticketId: ticket.id,
      });
    expect(res.status).toBe(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
