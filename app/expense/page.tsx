"use client";
import { ExpenseCard, ExpenseCardSkeleton } from "@/components/expenseCard";
import PageError from "@/components/pageError";
import fetcher from "@/lib/fetcher";
import { ExpenseHistoryResponse, UserResponse } from "@/types/responses";
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
import { FaAngleLeft, FaArrowsRotate } from "react-icons/fa6";
import { DatePickerWithRange } from "@/components/ui/datePickerWithRange";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Page() {
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState([1]);
  const [date, setDate] = useState<DateRange | undefined>();
  const [payer, setPayer] = useState("");
  const pageSize = 10;

  const cookies = useCookies();

  const participants = useSWR<{ data: UserResponse[] }, Error>(
    "/api/users",
    fetcher
  );

  const expensesHistory = useSWR<
    { data: ExpenseHistoryResponse[]; count: string },
    Error
  >(
    `api/expenses/history?size=${pageSize}&number=${page}${
      date
        ? !date.to && date.from
          ? "&from=" +
            new Date(date.from.setHours(0, 0, 0, 0)).toISOString() +
            "&to=" +
            new Date(date.from.setHours(23, 59, 59, 999)).toISOString()
          : date.to && date.from
          ? "&from=" +
            new Date(date.from.setHours(0, 0, 0, 0)).toISOString() +
            "&to=" +
            new Date(date.to?.setHours(23, 59, 59, 999)).toISOString()
          : ""
        : ""
    }${payer ? "&payer=" + payer : ""}`,
    fetcher
  );

  const count = expensesHistory.data?.count;
  useEffect(() => {
    if (!!count) {
      const totalSize = Math.ceil(parseInt(count) / pageSize);
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

  useEffect(() => {
    setPage(1);
  }, [payer, date]);

  const resetFilters = () => {
    setDate(undefined);
    setPayer("");
  };

  if (expensesHistory.error || participants.error) return <PageError />;

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
      <div>
        <div className="flex py-2 items-center w-full justify-between">
          <span>Filtrar por:</span>
          <button onClick={resetFilters}>
            <FaArrowsRotate className="text-slate-500" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Select onValueChange={(value) => setPayer(value)} value={payer}>
            <SelectTrigger>
              <SelectValue placeholder="Quem pagou a conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {participants.data?.data.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <DatePickerWithRange date={date} setDate={setDate} />
        </div>
      </div>
      <ul className="flex flex-col gap-3">
        {expensesHistory.data ? (
          expensesHistory.data.data.length > 0 ? (
            expensesHistory.data.data.map((expense) => (
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
            <div className="flex items-center justify-center w-full py-5">
              <span className="text-slate-400">Nenhum dado encontrado</span>
            </div>
          )
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
                setPage(
                  count && Math.ceil(parseInt(count) / pageSize) > 1
                    ? Math.ceil(parseInt(count) / pageSize)
                    : 1
                )
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
}
