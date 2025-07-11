"use client";

import FormDataConverter from "@/lib/form-data-converter.util";
import React, { useCallback, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { DeleteTicketData, deleteTicketSchema } from "@/lib/validator/ticket.validator";
import { deleteTicket } from "@/lib/data-action/ticket";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "next/dist/server/api-utils";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Ticket } from "@prisma/client";
import { IconTrash2 } from "../ui/icon";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

type FormDialogDeleteTicketProps = { ticket: Ticket };

export default function FormDialogDeleteTicket({ ticket }: FormDialogDeleteTicketProps) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<DeleteTicketData>({
    resolver: zodResolver(deleteTicketSchema),
    defaultValues: { ticketId: ticket.id },
  });

  const handleOnSubmit = useCallback(
    async (data: DeleteTicketData) => {
      setPending(true);
      try {
        const res = await deleteTicket(undefined, FormDataConverter.from(data));

        if (res?.error) return alert(res.error);

        router.refresh();
        setOpen(false);
        form.reset();
      } catch (err: unknown) {
        if (err instanceof ApiError) alert(err.message);
        else alert("Erro desconhecido ao deletar ingresso. Porfavor tente novamente.");
      } finally {
        setPending(false);
      }
    },
    [router, form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem variant="destructive" onSelect={(e) => e.preventDefault()}>
          <IconTrash2 />
          Deletar
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deletar Ingresso</DialogTitle>
        </DialogHeader>

        <DialogDescription>Por favor leia atentamente as informações.</DialogDescription>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col gap-3">
            <p className="rounded border border-red-400 bg-red-400/15 p-2">
              <strong className="mb-2 flex justify-center">⚠️ Esta ação não pode ser desfeita ⚠️</strong>
              Somente clique em <strong>Deletar</strong> se a inserção deste ingresso foi um engano.
            </p>

            <Separator />

            <strong>Dados do comprador:</strong>
            <ul className="*:flex *:justify-between">
              <li>
                Nome: <strong>{ticket.userName}</strong>
              </li>
              <li>
                CPF: <strong>{ticket.userCPF}</strong>
              </li>
              <li>
                Email: <strong>{ticket.userEmail}</strong>
              </li>
              <li>
                Telefone: <strong>{ticket.userPhone}</strong>
              </li>
            </ul>

            <Button className="mt-2" type="submit" variant={"destructive"}>
              Deletar {pending ? "..." : ""}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
