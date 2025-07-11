import prisma from "../prisma/prisma";

export async function getManyPartiesWithBatches() {
  return await prisma.party.findMany({
    include: { batches: { orderBy: { order: "asc" } } },
  });
}
