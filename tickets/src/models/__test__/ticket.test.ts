import { Ticket } from "../ticket";

describe("When saving a ticket", () => {
  it("Implements optimistic concurrency control", async () => {
    // Create an instance of ticket
    const ticket = Ticket.build({
      title: "Concert",
      price: 5,
      userId: "123",
    });

    // Save the ticket to database
    await ticket.save();

    // Fetch the ticket twice
    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    // Make two separete changes for the tickets we fetched
    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    // Save the first fetched ticket
    await firstInstance!.save();

    // Save the first fetched ticket and expect an error
    await expect(secondInstance!.save()).rejects.toThrow();
  });

  it("Should increment the version number in multiple saves.", async () => {
    // Create an instance of ticket
    const ticket = Ticket.build({
      title: "Concert",
      price: 5,
      userId: "123",
    });

    // Save the ticket to database
    await ticket.save();
    expect(ticket.version).toBe(0);

    // First ticket update
    ticket.set({ price: 10 });
    await ticket.save();
    expect(ticket.version).toBe(1);

    // Second ticket update
    ticket.set({ price: 15 });
    await ticket.save();

    expect(ticket.version).toBe(2);
  });
});
