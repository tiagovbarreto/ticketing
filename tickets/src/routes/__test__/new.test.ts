import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

describe("When add new ticket", () => {
  it("should has a route handler listening to requests", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).not.toBe(404);
  });

  it("should only be accessed if user is signed in", async () => {
    const res = await request(app).post("/api/tickets").send({});
    expect(res.status).toBe(401);
  });

  it("should not return 401 if the user is signed in", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({});

    expect(res.status).not.toEqual(401);
  });

  it("should return an error if an invalid title is provided", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({
        title: "",
        price: 10,
      });

    expect(res.status).toBe(400);
  });

  it("should return an error if an invalid price is provided.", async () => {
    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({
        title: "Ticket title",
        price: -10,
      });

    expect(res.status).toBe(400);
  });

  it("should create successulfy a ticket if valid parameters are provided.", async () => {
    //Add in a check to make sure a ticket was created

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({ title: "Ticket Title", price: 10 });

    tickets = await Ticket.find({});
    expect(res.status).toEqual(201);
    expect(tickets.length).toEqual(1);
  });

  it("should publish an event", async () => {
    await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({ title: "Ticket Title", price: 10 });

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
