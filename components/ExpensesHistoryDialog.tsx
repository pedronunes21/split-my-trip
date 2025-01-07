"use client";
import { ExpenseCard, ExpenseCardSkeleton } from "@/components/expenseCard";
import PageError from "@/components/pageError";
import fetcher from "@/lib/fetcher";
import { ExpenseHistoryResponse } from "@/types/responses";
import useSWR from "swr";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import { DialogDescription, DialogTitle } from "./ui/dialog";

export default function ExpenseHistoryDialog() {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([1]);

  const pageSize = 1;

  const expensesHistory = useSWR<{ data: ExpenseHistoryResponse[] }, Error>(
    `api/expenses/history?size=${pageSize}&number=${page}`,
    fetcher
  );

  const expensesCount = useSWR<{ data: { count: string } }, Error>(
    "api/expenses/count",
    fetcher
  );

  const count = expensesCount.data?.data.count;
  useEffect(() => {
    if (count) {
      const totalSize = parseInt(count) / pageSize;
      let array = [1];

      if (totalSize <= 1) {
        array = [1];
      } else {
        if (page == 1) array = [1, 2];
        else if (page == totalSize) array = [page - 1, page];
        else array = [page - 1, page, page + 1];
      }
      setPagination(array);
    }
  }, [page, count]);

  if (expensesHistory.error || expensesCount.error) return <PageError />;

  return (
    <main>
      <div className="mb-7 flex flex-col">
        <DialogTitle>Gastos</DialogTitle>
        <DialogDescription>
          Todos os gastos realizados estão listados abaixo
        </DialogDescription>
      </div>

      <ul className="flex flex-col gap-3">
        {expensesHistory.data ? (
          expensesHistory.data?.data.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense_id={expense.id}
              user_name={expense.user.name}
              user_profile={expense.user.photo_url}
              date={expense.date}
              description={expense.description}
              amount={expense.amount}
            />
          ))
        ) : (
          <ExpenseCardSkeleton />
        )}
      </ul>
      <Pagination className="py-3">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setPage(1)} />
          </PaginationItem>
          {pagination.map((i) => {
            return (
              <PaginationItem key={i}>
                <PaginationLink onClick={() => setPage(i)} isActive={page == i}>
                  {i}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem>
            <PaginationNext
              onClick={() => setPage(count ? parseInt(count) / pageSize : 1)}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
