import { Document, model, Model, Schema } from "mongoose";

interface ITicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDocument extends ITicketAttributes, Document {}

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

ticketSchema.statics.build = (attributes: ITicketAttributes) => {
  return new Ticket(attributes);
};

const Ticket = model<ITicketDocument, ITicketModel>("Ticket", ticketSchema);

export { Ticket };
