import { z } from "zod";
import Validator from "./validator";

export const addNewTicketSchema = z.object({
  userName: z.string().nonempty({ message: "Campo obrigatório." }),
  userCPF: z.string().min(11, { message: "Mín. 11" }).max(11, { message: "Máx. 11" }),
  userEmail: z.string().nonempty({ message: "Campo obrigatório." }).email({ message: "E-mail inválido." }),
  userPhone: z.string().nonempty({ message: "Campo obrigatório." }),
  batchId: z.string().nonempty({ message: "Campo obrigatório." }),
  observation: z.string().optional(),
});
export type AddNewTicketData = z.infer<typeof addNewTicketSchema>;
export const addNewTicketDataValidator = new Validator(addNewTicketSchema);

export const confirmTicketSchema = z.object({
  ticketId: z.string().nonempty({ message: "Campo obrigatório." }),
});
export type ConfirmTicketData = z.infer<typeof confirmTicketSchema>;
export const confirmTicketDataValidator = new Validator(confirmTicketSchema);

export const deleteTicketSchema = confirmTicketSchema;
export type DeleteTicketData = z.infer<typeof deleteTicketSchema>;
export const deleteTicketDataValidator = new Validator(deleteTicketSchema);

export const updateTicketSchema = z.object({
  ticketId: z.string().nonempty({ message: "Campo obrigatório." }),
  userName: z.string().nonempty({ message: "Campo obrigatório." }),
  userCPF: z.string().min(11, { message: "Mín. 11" }).max(11, { message: "Máx. 11" }),
  userEmail: z.string().nonempty({ message: "Campo obrigatório." }).email({ message: "E-mail inválido." }),
  userPhone: z.string().nonempty({ message: "Campo obrigatório." }),
  batchId: z.string().nonempty({ message: "Campo obrigatório." }),
  observation: z.string().optional(),
});
export type UpdateTicketData = z.infer<typeof updateTicketSchema>;
export const updateTicketDataValidator = new Validator(updateTicketSchema);