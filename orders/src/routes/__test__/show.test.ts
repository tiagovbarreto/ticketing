import request from "supertest";
import { app } from "../../app";
import { Ticket, ITicketDocument } from "../../models/ticket";

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

const requestOrderById = async (userToken: string[], orderId: string) => {
  return await request(app)
    .get(`/api/orders/${orderId}`)
    .set("Cookie", userToken)
    .send();
};

describe("When searching an especific order", () => {
  it("Should fetch the correct order for the user", async () => {
    const ticket = await buildTicket();

    const userToken = await global.signin();

    const res = await requestOrderCreation(userToken, ticket);
    expect(res.status).toBe(201);

    const { body: order } = res;

    const res1 = await requestOrderById(userToken, order.id);
    expect(res1.status).toBe(200);
    expect(res1.body.id).toBe(order.id);
  });

  it("Should throw an error if the user tries to fetch an order that not belongs to him", async () => {
    const ticket = await buildTicket();

    const userTokenOne = await global.signin();
    const userTokenTwo = await global.signin();

    const res = await requestOrderCreation(userTokenOne, ticket);
    expect(res.status).toBe(201);

    const { body: order } = res;

    const res1 = await requestOrderById(userTokenTwo, order.id);
    expect(res1.status).toBe(401);
  });
});
