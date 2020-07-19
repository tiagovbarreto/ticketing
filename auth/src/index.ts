import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  console.log("Starting up auth service");

  //console.log('process.env.JWT_KEY=', process.env.JWT_KEY);
  if (!process.env.JWT_KEY) {
    throw new Error("JWT must be defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined.");
  }

  try {
    const url: string = process.env.MONGO_URI;
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    await mongoose.connect(url, config);
    console.log("Connected to mongodb.");
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log("Listening on port 3000");
  });
};

start();
