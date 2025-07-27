"use server";

import FormDataConverter from "../form-data-converter.util";
import prisma from "../prisma/prisma";
import Session from "@/auth/session";
import catchAsync from "../catch";

import { ApiError } from "next/dist/server/api-utils";
import { Role } from "@prisma/client";
import {
  addNewTicketDataValidator,
  confirmTicketDataValidator,
  deleteTicketDataValidator,
  updateTicketDataValidator,
} from "../validator/ticket.validator";

const LIMIT_PER_PAGE = 100;

export async function getAllTickets(filters?: {
  search?: string;
  page?: number;
  orderType?: "asc" | "desc";
  orderBy?: "ticketNumber" | "userName" | "confirmedAt";
}) {
  await Session.getOrRedirect();

  const skip = filters?.page ? (filters.page - 1) * LIMIT_PER_PAGE : 0;

  return await prisma.ticket.findMany({
    where: {
      OR: [
        { userName: { startsWith: filters?.search, mode: "insensitive" } },
        { seller: { name: { startsWith: filters?.search, mode: "insensitive" } } },
        { batch: { name: { startsWith: filters?.search, mode: "insensitive" } } },
        { batch: { party: { name: { startsWith: filters?.search, mode: "insensitive" } } } },
      ],
    },
    include: { batch: { include: { party: true } }, seller: true },
    orderBy: filters?.orderBy ? { [filters.orderBy]: filters.orderType ?? "asc" } : undefined,
    skip,
    take: LIMIT_PER_PAGE,
  });
}

export const addNewTicketManually = catchAsync(async (_state, formData) => {
  const rolesWithAccess: Role[] = [Role.ADMIN, Role.SALE_PERSON];
  const session = await Session.getOrRedirect();
  if (!rolesWithAccess.includes(session.userRole)) throw new ApiError(403, "Você não possui permissão para isto.");

  const data = await addNewTicketDataValidator.extractData(FormDataConverter.toRecord(formData));

  const duplicateTicket = await prisma.ticket.findFirst({
    where: { userCPF: data.userCPF, party: { batches: { some: { id: data.batchId } } } },
  });
  if (duplicateTicket) throw new ApiError(400, "Já existe um ingresso para este CPF nesta festa.");

  const purchasedDate = new Date();

  const batch = await prisma.batch.findUnique({ where: { id: data.batchId } });
  if (!batch) throw new ApiError(400, "Lote não encontrado.");

  await prisma.$transaction(async (tx) => {
    const party = await prisma.party.findUnique({ where: { id: batch.partyId } });
    if (!party) throw new ApiError(400, "Festa não encontrada.");

    const ticketNumber = party.lastTicketNumber + 1;
    await tx.batch.update({
      where: { id: data.batchId, AND: [{ currentAmount: batch.currentAmount }, { currentAmount: { gt: 0 } }] },
      data: {
        currentAmount: { decrement: 1 },
        party: { update: { lastTicketNumber: ticketNumber } },
        tickets: {
          create: {
            userCPF: data.userCPF,
            userEmail: data.userEmail,
            userName: data.userName,
            userPhone: data.userPhone,
            purchasedAt: purchasedDate,
            sellerId: session.user.id,
            ticketNumber: ticketNumber,
            observation: data.observation,
            partyId: batch.partyId,
          },
        },
      },
    });
  });

  return { success: true };
});

export const updateTicket = catchAsync(async (_state, formData) => {
  const rolesWithAccess: Role[] = [Role.ADMIN, Role.SALE_PERSON];
  const session = await Session.getOrRedirect();
  if (!rolesWithAccess.includes(session.userRole)) throw new ApiError(403, "Você não possui permissão para isto.");

  const data = await updateTicketDataValidator.extractData(FormDataConverter.toRecord(formData));

  const ticketToUpdate = await prisma.ticket.findUnique({ where: { id: data.ticketId } });
  if (!ticketToUpdate) throw new ApiError(400, "Ingresso não encontrado.");

  const duplicateTicket = await prisma.ticket.findFirst({
    where: {
      id: { not: ticketToUpdate.id },
      userCPF: data.userCPF,
      party: { batches: { some: { id: data.batchId } } },
    },
  });
  if (duplicateTicket) throw new ApiError(400, "Já existe um ingresso para este CPF nesta festa.");

  if (ticketToUpdate.sellerId !== session.user.id && session.userRole !== Role.ADMIN)
    throw new ApiError(403, "Somente administradores ou o responsável pela venta do ingresso podem editar.");

  if (ticketToUpdate.confirmedAt && session.userRole !== Role.ADMIN)
    throw new ApiError(403, "Somente administradores podem editar ingressos que já foram confirmados.");

  const batch = await prisma.batch.findUnique({ where: { id: data.batchId } });
  if (!batch) throw new ApiError(400, "Lote não encontrado.");

  await prisma.$transaction(async (tx) => {
    const batch = await tx.batch.findUnique({ where: { id: data.batchId } });
    if (!batch) throw new ApiError(400, "Lote não encontrado.");

    await tx.batch.update({ where: { id: ticketToUpdate.batchId }, data: { currentAmount: { increment: 1 } } });

    await tx.batch.update({
      where: { id: data.batchId, currentAmount: { gt: 0 } },
      data: {
        currentAmount: { decrement: 1 },
        tickets: {
          update: {
            where: { id: ticketToUpdate.id },
            data: {
              userCPF: data.userCPF,
              userEmail: data.userEmail,
              userName: data.userName,
              userPhone: data.userPhone,
              sellerId: session.user.id,
              observation: data.observation,
              partyId: batch.partyId,
            },
          },
        },
      },
    });
  });

  return { success: true };
});

export const confirmTicket = catchAsync(async (_state, formData) => {
  const rolesWithAccess: Role[] = [Role.ADMIN, Role.TREASURE];
  const session = await Session.getOrRedirect();
  if (!rolesWithAccess.includes(session.userRole)) throw new ApiError(403, "Você não possui permissão para isto.");

  const data = await confirmTicketDataValidator.extractData(FormDataConverter.toRecord(formData));

  await prisma.ticket.update({ where: { id: data.ticketId, confirmedAt: null }, data: { confirmedAt: new Date() } });
  return { success: true };
});

export const deleteTicket = catchAsync(async (_state, formData) => {
  const rolesWithAccess: Role[] = [Role.ADMIN, Role.SALE_PERSON];
  const session = await Session.getOrRedirect();
  if (!rolesWithAccess.includes(session.userRole)) throw new ApiError(403, "Você não possui permissão para isto.");

  const data = await deleteTicketDataValidator.extractData(FormDataConverter.toRecord(formData));

  const ticketToDelete = await prisma.ticket.findUnique({ where: { id: data.ticketId, confirmedAt: null } });
  if (!ticketToDelete) throw new ApiError(400, "Ingresso não encontrado ou já está confirmado.");

  if (ticketToDelete.sellerId !== session.user.id && session.userRole !== Role.ADMIN)
    throw new ApiError(403, "Somente administradores ou o responsável pela venta do ingresso podem excluir.");

  await prisma.batch.update({
    where: { id: ticketToDelete.batchId },
    data: { currentAmount: { increment: 1 }, tickets: { delete: { id: ticketToDelete.id } } },
  });

  return { success: true };
});
