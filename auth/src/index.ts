import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  //console.log('process.env.JWT_KEY=', process.env.JWT_KEY);
  if (!process.env.JWT_KEY) {
    throw new Error('JWT must be defined.');
  }

  try {
    const url: string = 'mongodb://auth-mongo-service:27017/auth';
    const config = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    };
    await mongoose.connect(url, config);
    console.log('Connected to mongodb.');
  } catch (error) {
    console.error(error);
  }

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
};

start();
