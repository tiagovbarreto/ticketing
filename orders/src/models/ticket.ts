import { Document, model, Model, Schema } from "mongoose";
import { Order, OrderStatus } from "./order";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicketAttributes {
  id: string;
  title: string;
  price: number;
}

interface ITicketDocument extends Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ITicketModel extends Model<ITicketDocument> {
  build(attributes: ITicketAttributes): ITicketDocument;
  findByEvent(data: {
    id: string;
    version: number;
  }): Promise<ITicketDocument | null>;
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: ITicketAttributes) => {
  return new Ticket({
    _id: attributes.id,
    title: attributes.title,
    price: attributes.price,
  });
};

ticketSchema.statics.findByEvent = (data: { id: string; version: number }) => {
  return Ticket.findOne({
    _id: data.id,
    version: data.version - 1,
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
