import FormDialogConfirmTicket from "@/components/form-dialog/confirm-ticket.form-dialog";
import FormDialogNewManTicket from "@/components/form-dialog/new-man-ticket.form-dialog";
import FormDialogUpdateTicket from "@/components/form-dialog/update-ticket.form-dialog";
import FormDialogDeleteTicket from "@/components/form-dialog/delete-ticket.form-dialog";
import DebounceSearchInput from "@/components/inputs/debounce-search-input";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MainLayout, MainLayoutContent, MainLayoutHeader, MainLayoutTitle } from "@/layouts/main-layout";
import { SearchParams } from "next/dist/server/request/search-params";
import { getManyPartiesWithBatches } from "@/lib/data-action/party";
import { IconEllipsisVertical } from "@/components/ui/icon";
import { getAllTickets } from "@/lib/data-action/ticket";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SelectOrderBy from "@/components/selects/SelectOrderBy";
import SelectOrderType from "@/components/selects/SelectOrderType";
import Session from "@/auth/session";
import { Role } from "@prisma/client";

const orderTypeOptions = [
  { value: "asc", label: "Ascendente" },
  { value: "desc", label: "Descendente" },
];
const orderByOptions = [
  { label: "Nº Ingresso", value: "ticketNumber" },
  { label: "Comprador", value: "userName" },
  { label: "Confirmado em", value: "confirmedAt" },
];

export default async function TicketsPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const session = await Session.getOrRedirect();

  const search = searchParams.search;
  if (search && typeof search !== "string") return redirect(`/system/tickets`);

  const orderBy = searchParams.orderBy;
  if (typeof orderBy !== "string" || orderByOptions.every(({ value }) => value !== orderBy))
    return redirect(`/system/tickets?orderBy=${orderByOptions[0].value}`);

  const orderType = searchParams.orderType;
  if (typeof orderType !== "string" || orderTypeOptions.every(({ value }) => value !== orderType))
    return redirect(`/system/tickets?orderBy=${orderBy}&orderType=${orderTypeOptions[0].value}`);

  const tickets = await getAllTickets({ search, orderBy: orderBy as "ticketNumber", orderType: orderType as "asc" });
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

        <div className="flex w-full gap-3">
          <SelectOrderType orders={orderTypeOptions} searchParamKey="orderType" />
          <SelectOrderBy orders={orderByOptions} searchParamKey="orderBy" />
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
                        className={cn(ticket.confirmedAt && session.userRole !== Role.ADMIN && "hidden")}
                      >
                        <IconEllipsisVertical />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent>
                      <DropdownMenuGroup>
                        {!ticket.confirmedAt && <FormDialogConfirmTicket ticket={ticket} />}
                        <FormDialogUpdateTicket ticket={ticket} parties={parties} />
                        {!ticket.confirmedAt && <FormDialogDeleteTicket ticket={ticket} />}
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
