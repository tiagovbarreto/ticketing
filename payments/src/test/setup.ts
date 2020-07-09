import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { JWTHelper } from "@braves-corp/common";

declare global {
  namespace NodeJS {
    interface Global {
      signin(id?: string): Promise<string[]>;
    }
  }
}

jest.mock("../nats-wrapper");

let mongo: any;
beforeAll(async () => {
  //jest.setTimeout(30000);
  process.env.JWT_KEY = "asdfasdf";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  jest.clearAllMocks();

  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin = async (id?: string) => {
  //Buil a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  //Create the token
  const token = await JWTHelper.generateAuthToken(payload);

  //Build a session object { jwt: MY_JWT }
  const session = { jwt: token };

  //Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  //Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  //Return a string that is the cookie with the encode data
  return [`express:sess=${base64}`];
};
