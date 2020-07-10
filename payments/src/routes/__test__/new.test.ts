import request from "supertest";
import { app } from "../../app";
import { Order, OrderStatus } from "../../models/order";
import { Types } from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

jest.mock("../../stripe");

let orderId: any;
let userId: any;
let status: any;
let cookie: any;

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
    .set("Cookie", cookie)
    .send({
      token: "tok_visa",
      orderId: orderId,
    });

  return res;
};
beforeEach(async () => {
  orderId = Types.ObjectId().toHexString();
  userId = Types.ObjectId().toHexString();
  cookie = await global.signin();
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
    cookie = await global.signin(userId);
    const res = await paymentRequest();

    expect(res.status).toBe(400);
  });

  it("Should return a 201 with valid inputs.", async () => {
    const order = await buildOrder();

    orderId = order.id;
    cookie = await global.signin(userId);
    const res = await paymentRequest();

    expect(res.status).toBe(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual("tok_visa");
    expect(chargeOptions.amount).toEqual(10 * 100);
    expect(chargeOptions.currency).toEqual("usd");
  });

  /*  it("Should create a payments.", async () => {
    const order = await buildOrder();

    orderId = order.id;
    cookie = await global.signin(userId);
    const res = await paymentRequest();

    expect(res.status).toBe(201);

    const chargeResult = await (stripe.charges.create as jest.Mock).mock
      .results[0].value;

    const payment = await Payment.findOne({
      orderId,
      stripeId: chargeResult.id,
    });

    expect(payment).toBeDefined();
    expect(payment!.orderId).toEqual(order.id);
    expect(payment!.stripeId).toEqual(chargeResult.id);
  });*/
});
