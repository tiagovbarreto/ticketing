import request from "supertest";
import { app } from "../../app";
import { Types } from "mongoose";

describe("When fetching a ticket", () => {
  it("Should return 404 if the ticket is not found ", async () => {
    const id = new Types.ObjectId().toHexString();

    const res = await request(app).get(`/api/tickets/${id}`);
    expect(res.status).toBe(404);
  });

  it("Should return the ticket if it exists", async () => {
    const title = "Concert";
    const price = 20;

    const res = await request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({
        title,
        price,
      });

    expect(res.status).toBe(201);

    const res1 = await request(app).get(`/api/tickets/${res.body.id}`).send();

    expect(res1.status).toBe(200);
    expect(res1.body.title).toBe(title);
    expect(res1.body.price).toBe(price);
  });
});
