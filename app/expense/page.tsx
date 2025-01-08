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
import { useCookies } from "next-client-cookies";
import Link from "next/link";
import { FaAngleLeft } from "react-icons/fa6";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([1]);

  const cookies = useCookies();

  const pageSize = 2;

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
      const totalSize = Math.floor(parseInt(count) / pageSize) + 1;
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
    <main className="p-3">
      <div className="mb-7 flex flex-col">
        <div className="relative">
          <div className="absolute top-[50%] translate-y-[-50%] left-[20px] bg-slate-100 p-3 rounded-full">
            <Link href="/dashboard">
              <FaAngleLeft className="text-slate-400" />
            </Link>
          </div>
          <h1 className="text-3xl text-center text-slate-700 font-semibold">
            Gastos
          </h1>
        </div>
        <span className="text-gray-400 text-sm text-center">
          Todos os gastos realizados estão listados abaixo
        </span>
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
              created_by={expense.created_by}
              active_user={cookies.get("user_id")}
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
              onClick={() =>
                setPage(count ? Math.floor(parseInt(count) / pageSize) + 1 : 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
