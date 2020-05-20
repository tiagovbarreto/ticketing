import request from "supertest";
import { app } from "../../app";

describe("when call current-user", () => {
  const credentials: any = {
    email: "test@test.com",
    password: "password",
  };

  it("should retrive user details", async () => {
    const resSignup = await request(app)
      .post("/api/users/signup")
      .send(credentials);
    expect(resSignup.status).toBe(201);

    const cookie = resSignup.get("Set-Cookie");

    const res = await request(app)
      .get("/api/users/current-user")
      .set("Cookie", cookie)
      .send()
      .expect(200);

    expect(res.body.currentUser.email).toEqual("test@test.com");
  });

  it("should retrive null if no user is authenticated", async () => {
    const res = await request(app).get("/api/users/current-user").send();
    expect(res.status).toBe(200);
    expect(res.body.currentUser).toBe(null);
  });
});
