import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Types } from "mongoose";

let token: any;
let orderId: any;
let status: any;
let userId: any;

const buildOrder = async () => {
  const order = Order.build({
    id: Types.ObjectId().toHexString(),
    price: 10,
    status: status,
    userId: userId,
    version: 0,
  });
  await order.save();

  return order;
};

const paymentRequest = async () => {
  const res = await request(app)
    .post("/api/payments")
    .set("Cookie", token)
    .send({
      token: "anytoken",
      orderId: orderId,
    });

  return res;
};
beforeEach(async () => {
  orderId = Types.ObjectId().toHexString();
  userId = Types.ObjectId().toHexString();
  token = await global.signin();
  status = OrderStatus.CREATED;
});

describe("When purchasing an order", () => {
  it("Should return a 404 if the purchased order do not exists", async () => {
    const res = await paymentRequest();

    expect(res.status).toBe(404);
  });

  it("Should return a 401 if the purchased order do not belong to the logged user.", async () => {
    const order = await buildOrder();

    orderId = order.id;
    const res = await paymentRequest();

    expect(res.status).toBe(401);
  });

  it("Should return 400 if the purchased order is cancelled.", async () => {
    status = OrderStatus.CANCELLED;
    const order = await buildOrder();

    orderId = order.id;
    token = await global.signin(userId);
    const res = await paymentRequest();

    expect(res.status).toBe(400);
  });
});
