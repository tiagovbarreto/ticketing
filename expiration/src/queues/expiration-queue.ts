import Queue from "bull";
import { ExpirationCompletedPublisher } from "../events/publishers/expiration-completed-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
  orderId: string;
}

const queueOptions = {
  redis: {
    host: process.env.REDIS_HOST,
  },
};

const expirationQueue = new Queue<Payload>("order:expiration", queueOptions);

expirationQueue.process(async (job) => {
  const publisher = new ExpirationCompletedPublisher(natsWrapper.client);
  await publisher.publish({ orderId: job.data.orderId });
});

export { expirationQueue };
