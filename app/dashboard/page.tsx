"use client";
import ExpenseCard from "@/components/expenseCard";
import { Button } from "@/components/ui/button";
import fetcher from "@/lib/fetcher";
import { ExpenseHistoryResponse, GroupResponse } from "@/types/responses";
import Image from "next/image";
import { Suspense } from "react";
import useSWR from "swr";

export default function Dashboard() {
  const groups = useSWR<{ data: GroupResponse }, Error>("/api/groups", fetcher);

  const expenses = useSWR<{ data: ExpenseHistoryResponse[] }, Error>(
    "api/expenses/history",
    fetcher
  );

  if (groups.error || expenses.error) return <div>Failed to load</div>;
  if (!groups.data) return <div>Loading...</div>;

  console.log(expenses.data);

  return (
    <div className="flex flex-col justify-center p-4 gap-3">
      <h3 className="text-2xl font-semibold">{groups.data.data.title}</h3>
      <div
        style={{ backgroundImage: `url(${groups.data.data.photo_url})` }}
        className="max-w-screen-lg w-full bg-white rounded-lg shadow-md p-3 flex items-start space-x-4 bg-cover bg-center"
      >
        <div className="flex items-start space-x-4 bg-black bg-opacity-30 rounded-sm p-2 w-full">
          <div className="flex-shrink-0">
            <Image
              className="h-16 w-16 rounded-full"
              src="/avatar.webp"
              alt="Profile Picture"
              width={64}
              height={64}
            />
          </div>
          <div>
            <div className="flex flex-col">
              <span className="text-sm font-regular text-gray-200">Total</span>
              <strong className="text-3xl font-semibold text-white">
                R$ 36,90
              </strong>
            </div>
            <div className="flex flex-col pt-3 pl-3">
              <span className="text-red-300">
                Você deve <strong>R$ 12,55 </strong>
              </span>
              <span className="text-green-300">
                À receber <strong>R$ 49,35</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold pb-2">Gastos recentes</h3>
        <ul className="flex flex-col gap-3">
          <Suspense fallback={<div>Loading...</div>}>
            {expenses.data?.data.map((expense) => (
              <ExpenseCard
                key={expense.id}
                user_name={expense.user.name}
                user_profile={expense.user.photo_url}
                date={expense.date}
                description={expense.description}
                amount={expense.amount}
              />
            ))}
          </Suspense>
        </ul>
      </div>

      <nav className="flex items-center justify-between gap-2 w-[calc(100%-40px)] rounded-full bg-white shadow-sm fixed bottom-3 p-2 h-16 left-[50%] translate-x-[-50%] max-w-[450px]">
        <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">
          1
        </Button>
        <Button className="rounded-full w-full h-full bg-purple-400 shadow-none text-white">
          2
        </Button>
        <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">
          3
        </Button>
        <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">
          4
        </Button>
      </nav>
    </div>
  );
}
