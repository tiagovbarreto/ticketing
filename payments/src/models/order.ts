import { Document, model, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@braves-corp/common";

interface IOrderAttributes {
  id: string;
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

interface IOrderDocument extends Document {
  price: number;
  status: OrderStatus;
  userId: string;
  version: number;
}

interface IOrderModel extends Model<IOrderDocument> {
  build(attributes: IOrderAttributes): IOrderDocument;
}

const orderSchema = new Schema(
  {
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Number,
      required: true,
      enum: Object.values(OrderStatus),
    },
    userId: {
      type: String,
      required: true,
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

orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributes: IOrderAttributes) => {
  return new Order({
    _id: attributes.id,
    price: attributes.price,
    status: attributes.status,
    userId: attributes.userId,
    version: attributes.version,
  });
};

const Order = model<IOrderDocument, IOrderModel>("Order", orderSchema);

export { Order, OrderStatus };
