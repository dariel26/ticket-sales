"use client";

import { DialogTrigger } from "@radix-ui/react-dialog";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Batch, Party } from "@prisma/client";
import { ReactNode, useCallback, useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AddNewTicketData, addNewTicketSchema } from "@/lib/validator/ticket.validator";
import { addNewTicketManually } from "@/lib/data-action/ticket";
import FormDataConverter from "@/lib/form-data-converter.util";
import { ApiError } from "next/dist/server/api-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

type FormDialogNewManTicketProps = { children: ReactNode; parties: (Party & { batches: Batch[] })[] };

export default function FormDialogNewManTicket({ children, parties }: FormDialogNewManTicketProps) {
  const [pending, setPending] = useState(false);
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const form = useForm<AddNewTicketData>({
    resolver: zodResolver(addNewTicketSchema),
    defaultValues: { userName: "", userCPF: "", userEmail: undefined, userPhone: "", batchId: "", observation: undefined },
  });

  const handleOnSubmit = useCallback(
    async (data: AddNewTicketData) => {
      setPending(true);
      try {
        const res = await addNewTicketManually(undefined, FormDataConverter.from(data));
        if (res?.error) return alert(res.error);

        form.reset();
        router.refresh();
        setOpen(false);
      } catch (err: unknown) {
        if (err instanceof ApiError) alert(err.message);
        else alert("Erro desconhecido ao adicionar ingresso. Porfavor tente novamente.");
      } finally {
        setPending(false);
      }
    },
    [router, form]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Ingresso</DialogTitle>
        </DialogHeader>

        <DialogDescription>Adicione manualmente a venda de um ingresso.</DialogDescription>
        <Separator />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleOnSubmit)} className="flex flex-col gap-3">
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lote</FormLabel>
                  <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um lote" />
                      </SelectTrigger>
                      <SelectContent>
                        {parties
                          .flatMap((p) => p.batches)
                          .map((batch) => (
                            <SelectItem key={batch.id} value={batch.id} disabled={batch.currentAmount <= 0}>
                              <span>{batch.name}</span> -{" "}
                              <span className="text-muted-foreground">{batch.currentAmount}</span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <FormDescription>Dados do comprador</FormDescription>

            <div className="grid grid-cols-2 items-start gap-3">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>Nome que aparecerá na lista.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail (Opcional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="userCPF"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CPF</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={3}
                      onChange={(e) => {
                        if (e.target.value === "")
                          Object.assign(e, { ...e, target: { ...e.target, value: undefined } });
                        field.onChange(e);
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button className="mt-2" type="submit">
              Adicionar {pending ? "..." : ""}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
