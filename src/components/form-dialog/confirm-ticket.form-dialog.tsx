"use client";

import FormDataConverter from "@/lib/form-data-converter.util";
import React, { useCallback, useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { ConfirmTicketData, confirmTicketSchema } from "@/lib/validator/ticket.validator";
import { confirmTicket } from "@/lib/data-action/ticket";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "next/dist/server/api-utils";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Ticket } from "@prisma/client";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { IconCircleCheckBig } from "../ui/icon";

type FormDialogConfirmTicketProps = { ticket: Ticket };

export default function FormDialogConfirmTicket({ ticket }: FormDialogConfirmTicketProps) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<ConfirmTicketData>({
    resolver: zodResolver(confirmTicketSchema),
    defaultValues: { ticketId: ticket.id },
  });

  const handleOnSubmit = useCallback(
    async (data: ConfirmTicketData) => {
      setPending(true);
      try {
        const res = await confirmTicket(undefined, FormDataConverter.from(data));

        if (res?.error) return alert(res.error);

        router.refresh();
        setOpen(false);
        form.reset();
      } catch (err: unknown) {
        if (err instanceof ApiError) alert(err.message);
        else alert("Erro desconhecido ao confirmar ingresso. Porfavor tente novamente.");
      } finally {
        setPending(false);
      }
    },
    [router, form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <IconCircleCheckBig />
          Confirmar pagamento
        </DropdownMenuItem>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Pagamento do Ingresso</DialogTitle>
        </DialogHeader>

        <DialogDescription>Por favor leia atentamente as informações.</DialogDescription>

        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col gap-3">
            <p className="rounded border border-amber-400 bg-amber-400/15 p-2">
              <strong className="mb-2 flex justify-center">⚠️ Esta ação não pode ser desfeita ⚠️</strong>
              Somente clique em <strong>Confirmar</strong> se o pagamento deste ingresso foi realizado.
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

            <Button className="mt-2" type="submit">
              Confirmar {pending ? "..." : ""}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
