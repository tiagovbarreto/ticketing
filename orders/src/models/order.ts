import { Document, model, Model, Schema } from "mongoose";
import { OrderStatus } from "@braves-corp/common";
import { ITicketDocument } from "./ticket";

interface IOrderAttributes {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: ITicketDocument;
}

interface IOrderDocument extends IOrderAttributes, Document {}

interface IOrderModel extends Model<IOrderDocument> {
  build(attributes: IOrderAttributes): IOrderDocument;
}

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.CREATED,
    },
    expiresAt: {
      type: Schema.Types.Date,
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.statics.build = (attributes: IOrderAttributes) => {
  return new Order(attributes);
};

const Order = model<IOrderDocument, IOrderModel>("Order", orderSchema);

export { Order, OrderStatus };
