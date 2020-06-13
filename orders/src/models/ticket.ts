import { Document, model, Model, Schema } from "mongoose";
import { Order, OrderStatus } from "./order";

interface ITicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface ITicketDocument extends Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends Model<ITicketDocument> {
  build(attributes: ITicketAttributes): ITicketDocument;
}

const ticketSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
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

ticketSchema.statics.build = (attributes: ITicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

ticketSchema.methods.isReserved = async function () {
  //this === the ticket document
  const order = await Order.findOne({
    ticket: this,
    status: {
      $in: [OrderStatus.CREATED, OrderStatus.RESERVED, OrderStatus.PAYED],
    },
  });

  if (order) {
    return true;
  }

  return false;
};

const Ticket = model<ITicketDocument, ITicketModel>("Ticket", ticketSchema);

export { Ticket, ITicketDocument };