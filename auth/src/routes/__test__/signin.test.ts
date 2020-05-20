import request from "supertest";
import { app } from "../../app";

describe("when signin", () => {
  const urlSignin = "/api/users/signin";
  const urlSignup = "/api/users/signup";

  let credential: any = {};

  const execSignin = () => {
    return request(app).post(urlSignin).send(credential);
  };

  const execSignup = () => {
    return request(app).post(urlSignup).send(credential);
  };

  beforeEach(() => {
    credential.email = "test@test.com";
    credential.password = "password";
  });

  it("should return 200 if successulful signin.", async () => {
    await execSignup();
    const res = await execSignin();
    expect(res.status).toBe(200);
  });

  it("should return 400 if no email is provided", async () => {
    credential.email = "";
    const res = await request(app).post(urlSignin).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if the email provided does not exist.", async () => {
    const res = await execSignin();
    expect(res.status).toBe(400);
  });

  it("should return 400 if no password is provided", async () => {
    credential.password = "";
    const res = await request(app).post(urlSignin).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if wrong password is provided.", async () => {
    await execSignup();
    credential.password = "pass";
    const res = await execSignin();
    expect(res.status).toBe(400);
  });

  it("should set a cookie after successul signin", async () => {
    await execSignup();
    const res = await execSignin();
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
