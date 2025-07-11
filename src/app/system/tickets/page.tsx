import DebounceSearchInput from "@/components/inputs/debounce-search-input";

import { MainLayout, MainLayoutContent, MainLayoutHeader, MainLayoutTitle } from "@/layouts/main-layout";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SearchParams } from "next/dist/server/request/search-params";
import { getManyPartiesWithBatches } from "@/lib/data-action/party";
import { getAllTickets } from "@/lib/data-action/ticket";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { IconEllipsisVertical } from "@/components/ui/icon";
import FormDialogNewManTicket from "@/components/form-dialog/new-man-ticket.form-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup } from "@/components/ui/dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { cn } from "@/lib/utils";
import FormDialogConfirmTicket from "@/components/form-dialog/confirm-ticket.form-dialog";
import FormDialogDeleteTicket from "@/components/form-dialog/delete-ticket.form-dialog";
import FormDialogUpdateTicket from "@/components/form-dialog/update-ticket.form-dialog";

export default async function TicketsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const search = searchParams.search;

  if (search && typeof search !== "string") return null;

  const tickets = await getAllTickets({ search });
  const parties = await getManyPartiesWithBatches();

  return (
    <MainLayout>
      <MainLayoutHeader>
        <MainLayoutTitle>Ingressos</MainLayoutTitle>
      </MainLayoutHeader>

      <Separator />

      <MainLayoutContent>
        <div className="flex w-full gap-3">
          <DebounceSearchInput placeholder="Encontrar pelo nome, cpf, telefone..." />
          <FormDialogNewManTicket parties={parties}>
            <Button>Adicionar</Button>
          </FormDialogNewManTicket>
        </div>

        <Table>
          {tickets.length < 1 && <TableCaption>Nenhum ticket encontrado</TableCaption>}

          <TableHeader>
            <TableRow>
              <TableHead>Nº Ingresso</TableHead>
              <TableHead>Lote</TableHead>
              <TableHead>Vendedor</TableHead>
              <TableHead>Comprador</TableHead>
              <TableHead>CPF</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Observações</TableHead>
              <TableHead>Confirmado em</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>

          <TableBody>
            {tickets.map((ticket) => (
              <TableRow key={ticket.id} className={cn(ticket.confirmedAt && "bg-green-400/25")}>
                <TableCell>{ticket.ticketNumber}</TableCell>
                <TableCell>{ticket.batch.name}</TableCell>
                <TableCell>{ticket.seller.name}</TableCell>
                <TableCell>{ticket.userName}</TableCell>
                <TableCell>{ticket.userCPF}</TableCell>
                <TableCell>{ticket.userPhone}</TableCell>
                <TableCell>{ticket.observation}</TableCell>
                <TableCell>
                  {ticket.confirmedAt
                    ? ticket.confirmedAt.toLocaleDateString("pt-Br", { hour: "2-digit", minute: "2-digit" })
                    : "-- Not Confirmed --"}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        aria-label="Open actions menu"
                        className={cn(ticket.confirmedAt && "hidden")}
                      >
                        <IconEllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        <FormDialogConfirmTicket ticket={ticket} />
                        <FormDialogUpdateTicket ticket={ticket} parties={parties} />
                        <FormDialogDeleteTicket ticket={ticket} />
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </MainLayoutContent>
    </MainLayout>
  );
}
