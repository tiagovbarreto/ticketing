import { Subjects } from "./types/subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TickeUpdated;
  data: {
    id: string;
    version: number;
    title: string;
    price: number;
    userId: string;
  };
}
