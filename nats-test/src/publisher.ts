import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const client = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

client.on("connect", async () => {
  console.log("Publisher connected to nats.");

  try {
    const publisher = new TicketCreatedPublisher(client);

    const data = {
      id: "123",
      title: "Concert",
      price: 14,
    };

    await publisher.publish(data);
  } catch (err) {
    console.log(err);
  }
});
