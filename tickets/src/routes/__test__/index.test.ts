import request from "supertest";
import { app } from "../../app";

describe("get /", () => {
  const createTicket = async () => {
    return request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({ title: "My ticket", price: 10 });
  };

  it("should return all tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app).get("/api/tickets").send();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
});
