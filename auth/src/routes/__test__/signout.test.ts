import request from "supertest";
import { app } from "../../app";

describe("/api/users/signout", () => {
  const credential: any = {
    email: "test@test.com",
    password: "password",
  };

  const signup = () => {
    return request(app).post("/api/users/signup").send(credential);
  };

  const signout = () => {
    return request(app).post("/api/users/signout").send();
  };

  it("should return 200 if successful signout", async () => {
    await signup();
    const res = await signout();
    expect(res.status).toBe(200);
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
