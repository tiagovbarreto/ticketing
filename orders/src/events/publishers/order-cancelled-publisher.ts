import { Publisher, OrderCancelledEvent, Subjects } from "@braves-corp/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
