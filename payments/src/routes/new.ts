import { Request, Response, Router } from "express";
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  NotAuthorizedError,
  OrderStatus,
  BadRequestError,
} from "@braves-corp/common";
import { body } from "express-validator";
import { Order } from "../models/order";

const router = Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("orderId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    if (order.status == OrderStatus.CANCELLED) {
      throw new BadRequestError("Cannot pay for a cancelled order.");
    }

    res.status(200).send({ success: true });
  }
);

export { router as createChargeRouter };
