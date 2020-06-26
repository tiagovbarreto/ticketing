import {
  Publisher,
  ExpirationCompletedEvent,
  Subjects,
} from "@braves-corp/common";

export class ExpirationCompletedPublisher extends Publisher<
  ExpirationCompletedEvent
> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}
