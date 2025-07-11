import prisma from "../../src/lib/prisma/prisma";

import { insertSeeds } from "./scripts";

insertSeeds()
  .then(async () => {
    console.log("🌱 Seeds inserted successfully");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
