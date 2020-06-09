import { Request, Response, Router } from "express";
import { Order } from "../models/order";
import {
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from "@braves-corp/common";

const router = Router();

router.get(
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

    res.send(order);
  }
);

export { router as showOrderRouter };
