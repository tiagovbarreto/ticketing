import { Document, model, Model, Schema } from "mongoose";

interface IPaymentAttributes {
  orderId: string;
  stripeId: string;
}

interface IPaymentDocument extends Document {
  orderId: string;
  stripeId: string;
}

interface IPaymentModel extends Model<IPaymentDocument> {
  build(attributes: IPaymentAttributes): IPaymentDocument;
}

const paymentSchema = new Schema(
  {
    orderId: {
      required: true,
      type: String,
    },
    stripeId: {
      required: true,
      type: String,
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

paymentSchema.statics.build = (attributes: IPaymentAttributes) => {
  return new Payment({
    orderId: attributes.orderId,
    stripeId: attributes.stripeId,
  });
};

const Payment = model<IPaymentDocument, IPaymentModel>(
  "Payment",
  paymentSchema
);

export { Payment };
