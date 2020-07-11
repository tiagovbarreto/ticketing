import { Publisher, Subjects, PaymentCreatedEvent } from "@braves-corp/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
