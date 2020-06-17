import { Publisher, OrderCreatedEvent, Subjects } from "@braves-corp/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
