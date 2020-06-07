import { Subjects } from "./types/subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TickeUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
