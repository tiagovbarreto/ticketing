import request from "supertest";
import { app } from "../../app";

describe("When fetching all tickets", () => {
  const createTicket = async () => {
    return request(app)
      .post("/api/tickets")
      .set("Cookie", await global.signin())
      .send({ title: "My ticket", price: 10 });
  };

  it("Should return all tickets", async () => {
    await createTicket();
    await createTicket();
    await createTicket();

    const res = await request(app).get("/api/tickets").send();

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });
});
