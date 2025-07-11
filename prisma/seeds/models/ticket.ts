import { Ticket } from "@prisma/client";
import { userA } from "./user";
import { batchPromo } from "./batch";
import { partyHalfDoctor } from "./party";

export const ticketA: Ticket = {
  id: "1111-1111-1111-1111",
  userCPF: "11111111111",
  userEmail: "teste@gmail.com",
  userName: "Teste 1",
  userPhone: "11111111",
  batchId: batchPromo.id,
  purchasedAt: new Date("2025-01-01T20:00:00.000Z"),
  confirmedAt: new Date("2025-01-01T20:00:00.000Z"),
  sellerId: userA.id,
  observation: null,
  ticketNumber: 1,
  partyId: partyHalfDoctor.id,
};

export const ticketB: Ticket = {
  id: "2222-2222-2222-2222",
  userCPF: "222222222222",
  userEmail: "teste2@gmail.com",
  userName: "Teste 2",
  userPhone: "22222222",
  batchId: batchPromo.id,
  purchasedAt: new Date("2025-01-01T20:00:00.000Z"),
  confirmedAt: null,
  sellerId: userA.id,
  observation: null,
  ticketNumber: 2,
  partyId: partyHalfDoctor.id,
};
