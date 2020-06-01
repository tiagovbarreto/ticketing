import nats from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./events/ticket-created-listener";

console.clear();

const client = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

client.on("connect", () => {
  console.log("Listenner connected to nats");

  client.on("close", () => {
    console.log("NATS connection closed.");
    process.exit();
  });

  const listener = new TicketCreatedListener(client);
  listener.listen();
});

process.on("SIGINT", () => client.close());
process.on("SIGTERM", () => client.close());
