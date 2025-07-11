import { User } from "@prisma/client";

export const userA: User = {
  name: "Teste 1",
  id: "1111-1111-1111-1111",
  email: "teste@gmail.com",
  emailVerified: null,
  image: null,
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};

export const userB: User = {
  name: "Teste 2",
  id: "2222-2222-2222-2222",
  email: "teste2@gmail.com",
  emailVerified: null,
  image: null,
  createdAt: new Date("2025-01-01T20:00:00.000Z"),
  updatedAt: new Date("2025-01-01T20:00:00.000Z"),
};