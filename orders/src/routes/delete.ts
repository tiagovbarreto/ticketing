import { Request, Response, Router } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  OrderStatus,
} from "@braves-corp/common";
import { OrderCancelledPublisher } from "../events/publishers/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = Router();

router.delete(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await Order.findById(id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    const publisher = new OrderCancelledPublisher(natsWrapper.client);
    await publisher.publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
