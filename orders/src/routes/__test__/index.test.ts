import request from "supertest";
import { app } from "../../app";
import { Ticket, ITicketDocument } from "../../models/ticket";
import { Types } from "mongoose";

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: Types.ObjectId().toHexString(),
    title: "concert",
    price: 20,
  });
  await ticket.save();

  return ticket;
};

const apiOrdersUrl = "/api/orders";
const requestOrderCreation = async (
  user: string[],
  ticket: ITicketDocument
) => {
  return await request(app)
    .post(apiOrdersUrl)
    .set("Cookie", user)
    .send({ ticketId: ticket.id });
};

const requestUserOrders = async (user: string[]) => {
  return await request(app).get(apiOrdersUrl).set("Cookie", user);
};

describe("When retriving all the user's orders", () => {
  it("Should retrive all ther user's orders", async () => {
    // Create three tickets
    const ticketOne = await buildTicket();
    const ticketTwo = await buildTicket();
    const ticketThree = await buildTicket();

    // Greate users' tokens
    const userOne = await global.signin();
    const userTwo = await global.signin();

    // Create an order as user one
    const res1 = await requestOrderCreation(userOne, ticketOne);
    expect(res1.status).toBe(201);

    // Create two orders for user two
    const res2 = await requestOrderCreation(userTwo, ticketTwo);
    expect(res2.status).toBe(201);

    const res3 = await requestOrderCreation(userTwo, ticketThree);
    expect(res3.status).toBe(201);

    // Validate amount off tickets for user two
    const res4 = await requestUserOrders(userTwo);
    expect(res4.status).toBe(200);
    expect(res4.body.length).toBe(2);

    // Validate if the order id is correct
    expect(res4.body[0].id).toBe(res2.body.id);
    expect(res4.body[1].id).toBe(res3.body.id);

    // Validate if the tickets id are correct
    expect(res4.body[0].ticket.id).toBe(ticketTwo.id);
    expect(res4.body[1].ticket.id).toBe(ticketThree.id);
  });
});
