import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogDescription, DialogTitle } from "./ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useSWR from "swr";
import { ExpensesDetailsResponse } from "@/types/responses";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "./ui/skeleton";
import { moneyMask } from "@/lib/utils";

export default function ExpenseDetailsDialog() {
  const me = useSWR<{ data: ExpensesDetailsResponse[] }, Error>(
    `/api/expenses/details/me`,
    fetcher
  );

  const all = useSWR<{ data: ExpensesDetailsResponse[] }, Error>(
    `/api/expenses/details`,
    fetcher
  );

  if (me.error || all.error) return <div>Failed to load</div>;

  return (
    <main>
      <div className="py-3">
        <DialogTitle>Detalhes dos Gastos</DialogTitle>
        <DialogDescription>
          Abaixo segue o resumo dos gastos realizados
        </DialogDescription>
      </div>
      <Tabs defaultValue="me" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="me">Seus</TabsTrigger>
          <TabsTrigger value="all">Do grupo</TabsTrigger>
        </TabsList>
        <TabsContent value="me">
          <div className="relative h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-[-2px] bg-background">
                <TableRow>
                  <TableHead>Devedor</TableHead>
                  <TableHead className="text-center">Pagador</TableHead>
                  <TableHead className="text-right w-[100px]">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {me.data ? (
                  me.data.data.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-left">
                        {e.ower.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {e.payer.name}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        R$ {moneyMask(e.amount_owed)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <RowSkeleton />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        <TabsContent value="all">
          <div className="relative h-96 overflow-auto">
            <Table>
              <TableHeader className="sticky top-[-2px] bg-background">
                <TableRow>
                  <TableHead>Devedor</TableHead>
                  <TableHead className="text-center">Pagador</TableHead>
                  <TableHead className="text-right w-[100px]">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {all.data ? (
                  all.data.data.map((e, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium text-left">
                        {e.ower.name}
                      </TableCell>
                      <TableCell className="text-center">
                        {e.payer.name}
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        R$ {moneyMask(e.amount_owed)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <RowSkeleton />
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
}

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell className="font-medium text-left">
        <Skeleton className="w- full h-4" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="w- full h-4" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="w- full h-4" />
      </TableCell>
    </TableRow>
  );
}
