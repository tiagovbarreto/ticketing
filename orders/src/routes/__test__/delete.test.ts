import request from "supertest";
import { app } from "../../app";
import { Ticket, ITicketDocument } from "../../models/ticket";
import { Types } from "mongoose";
import { OrderStatus } from "../../models/order";
import { natsWrapper } from "../../nats-wrapper";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

const requestOrderCreation = async (
  user: string[],
  ticket: ITicketDocument
) => {
  return await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
};

const requestOrderDelete = async (user: string[], orderId: string) => {
  return await request(app)
    .delete(`/api/orders/${orderId}`)
    .set("Cookie", user)
    .send();
};

const requestOrderById = async (userToken: string[], orderId: string) => {
  return await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", userToken)
    .send();
};

describe("When deleting an especific order", () => {
  it("Should successfuly marks an order as cancelled", async () => {
    const ticket = await buildTicket();

    const userToken = await global.signin();

    const res = await requestOrderCreation(userToken, ticket);
    expect(res.status).toBe(201);

    const { body: order } = res;

    const res1 = await requestOrderDelete(userToken, order.id);
    expect(res1.status).toBe(204);

    const res2 = await requestOrderById(userToken, order.id);
    expect(res2.body.status).toBe(OrderStatus.CANCELLED);
  });

  it("Should throw an error if the user try to delete an order that does not exist", async () => {
    const userToken = await global.signin();
    const orderId = Types.ObjectId().toHexString();

    const res1 = await requestOrderDelete(userToken, orderId);
    expect(res1.status).toBe(404);
  });

  it("Should throw an error if the user tries to delete an order that not belongs to him", async () => {
    const ticket = await buildTicket();

    const userTokenOne = await global.signin();
    const userTokenTwo = await global.signin();

    const res = await requestOrderCreation(userTokenOne, ticket);
    expect(res.status).toBe(201);

    const { body: order } = res;

    const res1 = await requestOrderDelete(userTokenTwo, order.id);
    expect(res1.status).toBe(401);
  });

  it("Should emits an order cancelled event", async () => {
    const ticket = await buildTicket();

    const userToken = await global.signin();

    const res = await requestOrderCreation(userToken, ticket);
    expect(res.status).toBe(201);

    const { body: order } = res;

    const res1 = await requestOrderDelete(userToken, order.id);
    expect(res1.status).toBe(204);

    const res2 = await requestOrderById(userToken, order.id);
    expect(res2.body.status).toBe(OrderStatus.CANCELLED);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
