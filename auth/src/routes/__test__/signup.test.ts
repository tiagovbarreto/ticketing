import request from "supertest";
import { app } from "../../app";

describe("when signup", () => {
  const url: string = "/api/users/signup";

  let credential: any = {};

  const exec = () => {
    return request(app).post(url).send(credential);
  };

  beforeEach(() => {
    credential.email = "test@test.com";
    credential.password = "password";
  });

  it("should return 201 if correct credentials are provided", async () => {
    const res = await exec();
    expect(res.status).toBe(201);
  });

  it("should return 400 if no email is provided", async () => {
    credential.email = "";
    const res = await request(app).post(url).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if invalid email is provided", async () => {
    credential.email = "test.com";
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it("should return 400 if no password is provided", async () => {
    credential.password = "";
    const res = await request(app).post(url).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if no password provided is less then 4", async () => {
    credential.password = "xxx";
    const res = await request(app).post(url).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if no password provided is more then 20", async () => {
    credential.password = new Array(22).join("x");
    const res = await request(app).post(url).send(credential);
    expect(res.status).toBe(400);
  });

  it("should return 400 if duplicate email is provided", async () => {
    const res = await exec();
    const res2 = await exec();
    expect(res2.status).toBe(400);
  });

  it("should set a cookie after successul signup", async () => {
    const res = await exec();
    expect(res.get("Set-Cookie")).toBeDefined();
  });
});
