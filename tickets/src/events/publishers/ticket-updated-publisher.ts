import { Publisher, Subjects, TicketUpdatedEvent } from "@braves-corp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TickeUpdated = Subjects.TickeUpdated;
}
