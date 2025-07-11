import Image from "next/image";

import { MainLayout, MainLayoutContent, MainLayoutHeader, MainLayoutTitle } from "@/layouts/main-layout";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getManyPartiesWithBatches } from "@/lib/data-action/party";
import { IconBankNote, IconCalendarClock, IconMapPin, IconTickets, IconUser, IconWhatsapp } from "@/components/ui/icon";
import { monetaryToString } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

export default async function Parties() {
  const parties = await getManyPartiesWithBatches();
  const salePeople = [
    { name: "Yasmin Petter Pires", wpp: "554898646668" },
    { name: "Ruan Marcelo Gonçalves", wpp: "554896428511" },
    { name: "Júlia Cristina Pires de Campos", wpp: "554899674055" },
    { name: "Leticia de Souza Nunes", wpp: "554891150590" },
    { name: "Bruna da Rosa Costa", wpp: "5549988683029" },
  ];

  return (
    <MainLayout>
      <MainLayoutHeader>
        <MainLayoutTitle>Eventos</MainLayoutTitle>
      </MainLayoutHeader>

      <Separator />

      <MainLayoutContent className="items-center">
        {parties.map((party) => {
          const disponibleBatch = party.batches.find((b) => b.currentAmount > 0);

          return (
            <Card className="h-[max-content] w-[max-content] gap-0 pt-0" key={party.id}>
              <div className="relative mb-6 flex w-full overflow-hidden rounded-t-[inherit]">
                <Image
                  className="bg-accent flex aspect-[2/1] w-[28rem] object-cover"
                  width={400}
                  height={100}
                  src={"/art.webp"}
                  alt={party.name}
                />
                <h2 className="absolute top-0 mx-3 my-3 rounded bg-black/50 px-2 text-2xl font-extrabold text-white">
                  {party.name}
                </h2>
              </div>

              <span className="text-muted-foreground text-center">Sobre o evento</span>

              <ol className="my-2 mb-6 flex flex-col gap-1 px-6 *:inline-flex *:items-center *:gap-3">
                <li>
                  <IconMapPin />
                  <span>
                    {party.city} - {party.locale}
                  </span>
                </li>
                <li>
                  <IconCalendarClock />
                  <span>{party.eventDate.toLocaleDateString("pt-Br", { hour: "2-digit", minute: "2-digit" })}</span>
                </li>
                {party.description && (
                  <li className="mt-2 justify-center text-center italic">* {party.description} *</li>
                )}
              </ol>

              <CardContent className="flex flex-col gap-6 text-lg">
                {disponibleBatch && (
                  <div className="border-primary I flex flex-col gap-3 rounded-lg border-2 p-3 text-lg">
                    <span className="text-center font-bold">Lote Nº {disponibleBatch.name}</span>

                    <ol className="my-2 flex flex-col *:inline-flex *:items-center *:gap-3">
                      <li>
                        <IconTickets />
                        <span>
                          Restam <strong>{disponibleBatch.currentAmount}</strong> ingressos
                        </span>
                      </li>
                      <li>
                        <IconBankNote />
                        <span>
                          <strong>{monetaryToString(disponibleBatch.price)}</strong> por ingresso
                        </span>
                      </li>
                    </ol>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Adquirir Ingresso</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle> Adquira seu ingresso</DialogTitle>
                          <DialogDescription>
                            Entre em contato com um de nossos vendedores pelo Whatsapp.
                          </DialogDescription>
                        </DialogHeader>

                        <ul>
                          {salePeople.map((person) => (
                            <li key={person.name} className="flex w-full justify-between space-y-3">
                              <span className="inline-flex items-center gap-2">
                                <IconUser className="size-4" />
                                {person.name}
                              </span>

                              <Link
                                href={`https://wa.me/${person.wpp}`}
                                className="flex items-center gap-2 font-semibold underline"
                              >
                                Conversar <IconWhatsapp className="size-5 fill-green-800" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </MainLayoutContent>
    </MainLayout>
  );
}
