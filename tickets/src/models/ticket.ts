import { Document, model, Model, Schema } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ITicketAttributes {
  title: string;
  price: number;
  userId: string;
}

interface ITicketDocument extends Document {
  title: string;
  price: number;
  userId: string;
  version: number;
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

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = (attributes: ITicketAttributes) => {
  return new Ticket(attributes);
};

const Ticket = model<ITicketDocument, ITicketModel>("Ticket", ticketSchema);

export { Ticket };
