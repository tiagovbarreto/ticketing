import { Document, Model, model, Schema } from "mongoose";
import { JWTHelper } from "@braves-corp/common";

// An interface that describes the properties
// that are nequired to create a new user
interface IUserAttributes {
  email: string;
  password: string;
}

// An interface that describes the properties
// that the user document has
interface IUserDocument extends IUserAttributes, Document {}

// An interface that describes the properties
// that the user model has
interface IUserModel extends Model<IUserDocument> {
  build(user: IUserAttributes): IUserDocument;
}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    const hashed = await JWTHelper.toHash(this.get("password"));
    this.set("password", hashed);
  }

  done();
});

userSchema.statics.build = (user: IUserAttributes) => {
  return new User(user);
};

const User = model<IUserDocument, IUserModel>("User", userSchema);

export { User };
