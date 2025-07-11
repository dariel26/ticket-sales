import prisma from "../../src/lib/prisma/prisma";

import { batch01, batch02, batch03, batchPromo } from "./models/batch";
import { ticketA, ticketB } from "./models/ticket";
import { partyHalfDoctor } from "./models/party";
import { userA, userB } from "./models/user";
import { roleAdmin } from "./models/userRoles";

export async function insertSeeds() {
  await prisma.user.createMany({ data: [userA, userB] });

  await prisma.userRole.createMany({ data: [roleAdmin] });

  await prisma.party.createMany({ data: [partyHalfDoctor] });

  await prisma.batch.createMany({
    data: [batchPromo, batch01, batch02, batch03],
  });

  await prisma.ticket.createMany({ data: [ticketA, ticketB] });
}

export async function clearSeeds() {
  await prisma.ticket.deleteMany();

  await prisma.batch.deleteMany();

  await prisma.party.deleteMany();

  await prisma.userRole.deleteMany();

  await prisma.user.deleteMany();
}
