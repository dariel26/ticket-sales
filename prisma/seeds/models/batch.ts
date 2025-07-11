import { Batch } from "@prisma/client";
import { partyHalfDoctor } from "./party";

export const batchPromo: Batch = {
  id: "0000-0000-0000-0000",
  name: "Promocional",
  maxAmount: 3,
  currentAmount: 1,
  partyId: partyHalfDoctor.id,
  order: 1,
  price: 5500, // 55 Reais
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};

export const batch01: Batch = {
  id: "1111-1111-1111-1111",
  name: "01",
  maxAmount: 260,
  currentAmount: 260,
  partyId: partyHalfDoctor.id,
  order: 2,
  price: 6000, // 60 Reais
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};

export const batch02: Batch = {
  id: "2222-2222-2222-2222",
  name: "02",
  maxAmount: 200,
  currentAmount: 200,
  partyId: partyHalfDoctor.id,
  order: 3,
  price: 6500, // 65 Reais
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};

export const batch03: Batch = {
  id: "3333-3333-3333-3333",
  name: "03",
  maxAmount: 200,
  currentAmount: 200,
  partyId: partyHalfDoctor.id,
  order: 4,
  price: 7000, // 70 Reais
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};
