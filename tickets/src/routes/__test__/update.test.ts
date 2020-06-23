import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";
import { natsWrapper } from "../../nats-wrapper";
import { Ticket } from "../../models/ticket";

let ticketId: any;
let token: any;
let title: any = "Concert";
let price: any = 10;

const updateTicket = () => {
  return request(app)
    .put(`/api/tickets/${ticketId}`)
    .set("Cookie", token)
    .send({ title: title, price: price });
};

const createTicket = () => {
  return request(app)
    .post("/api/tickets")
    .set("Cookie", token)
    .send({ title: "Concert", price: 10 });
};

beforeEach(async () => {
  ticketId = Types.ObjectId().toHexString();
  token = await global.signin();
});

describe("When updating a ticket", () => {
  it("Should return a 404 if the ticket id does not exists", async () => {
    ticketId = "";
    const res = await updateTicket();
    expect(res.status).toBe(404);
  });

  it("Should return a 401 if the user is not authenticated", async () => {
    token = "";
    const res = await updateTicket();
    expect(res.status).toBe(401);
  });

  it("Should return a 401 if the user not own the ticket", async () => {
    const res = await createTicket();
    expect(res.status).toBe(201);

    title = "Rock Concert";
    price = 15;
    ticketId = res.body.id;
    token = await global.signin();

    const res1 = await updateTicket();
    expect(res1.status).toBe(401);
  });

  it("Should return a 400 if no title is provided", async () => {
    title = undefined;
    const res = await updateTicket();
    expect(res.status).toBe(400);
  });

  it("Should return a 400 if no valid title is provided", async () => {
    title = "";
    const res = await updateTicket();
    expect(res.status).toBe(400);
  });

  it("Should return a 400 if no price is provided", async () => {
    price = undefined;
    const res = await updateTicket();
    expect(res.status).toBe(400);
  });

  it("Should return a 400 if no valid price is provided", async () => {
    price = -10;
    const res = await updateTicket();
    expect(res.status).toBe(400);
  });

  it("Should successufuly update a ticket if valid input is provided", async () => {
    const res = await createTicket();
    expect(res.status).toBe(201);

    title = "Rock Concert";
    price = 15;
    ticketId = res.body.id;

    const res1 = await updateTicket();
    expect(res1.status).toBe(200);
    expect(res1.body.title).toBe(title);
    expect(res1.body.price).toBe(price);
  });

  it("Should publish an event", async () => {
    const res = await createTicket();
    expect(res.status).toBe(201);

    title = "Rock Concert";
    price = 15;
    ticketId = res.body.id;

    const res1 = await updateTicket();
    expect(res1.status).toBe(200);
    expect(res1.body.title).toBe(title);
    expect(res1.body.price).toBe(price);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });

  it("Should reject update if ticket is reserved", async () => {
    const res = await createTicket();
    expect(res.status).toBe(201);

    title = "Rock Concert";
    price = 15;
    ticketId = res.body.id;

    const ticket = await Ticket.findById(ticketId);
    ticket!.set({ orderId: Types.ObjectId().toHexString() });
    await ticket!.save();

    const res1 = await updateTicket();
    expect(res1.status).toBe(400);
  });
});
