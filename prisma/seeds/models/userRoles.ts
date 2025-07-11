import { UserRole } from "@prisma/client";
import { userA } from "./user";

export const roleAdmin: UserRole = {
  id: "1111-1111-1111-1111",
  role: "ADMIN",
  userId: userA.id,
};
