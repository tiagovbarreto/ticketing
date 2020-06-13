import express, { Request, Response } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from "@braves-corp/common";
import { body } from "express-validator";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";
import { natsWrapper } from "../nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-cancelled-publisher";

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .not()
      .isEmpty()
      //.custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage("TicketId must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved.");
    }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() * EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expiration,
      ticket: ticket,
    });

    await order.save();

    const publisher = new OrderCreatedPublisher(natsWrapper.client);
    await publisher.publish({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };