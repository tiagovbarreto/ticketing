import { Document, model, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface IPaymentAttributes {
  orderId: string;
  stripeId: string;
}

interface IPaymentDocument extends Document {
  orderId: string;
  price: number;
}

interface IPaymentModel extends Model<IPaymentDocument> {
  build(attributes: IPaymentAttributes): IPaymentDocument;
}

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    stripeId: {
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

orderSchema.statics.build = (attributes: IPaymentAttributes) => {
  return new Payment({ attributes });
};

const Payment = model<IPaymentDocument, IPaymentModel>("Payment", orderSchema);

export { Payment };
