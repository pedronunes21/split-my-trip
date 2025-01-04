"use client";
import { ExpenseCard, ExpenseCardSkeleton } from "@/components/expenseCard";
import ExpensesOverview from "@/components/expensesOverview";
import ScreenLoading from "@/components/screenLoading";
import { Button } from "@/components/ui/button";
import fetcher from "@/lib/fetcher";
import {
  ExpenseHistoryResponse,
  ExpensesOverviewResponse,
  GroupResponse,
} from "@/types/responses";
import { Suspense } from "react";
import useSWR from "swr";

export default function Dashboard() {
  const groups = useSWR<{ data: GroupResponse }, Error>("/api/groups", fetcher);

  const expensesHistory = useSWR<{ data: ExpenseHistoryResponse[] }, Error>(
    "api/expenses/history",
    fetcher
  );

  const expensesOverview = useSWR<{ data: ExpensesOverviewResponse }, Error>(
    "api/expenses/overview?me=true",
    fetcher
  );

  if (groups.error || expensesHistory.error || expensesOverview.error)
    return <div>Failed to load</div>;

  if (!groups.data) return <ScreenLoading />;

  console.log(expensesOverview.data);

  return (
    <div className="flex flex-col justify-center p-4 gap-3">
      <h3 className="text-2xl font-semibold">{groups.data.data.title}</h3>
      <ExpensesOverview
        balance={expensesOverview.data?.data.balance}
        debt={expensesOverview.data?.data.debt}
        surplus={expensesOverview.data?.data.surplus}
        group_photo={groups.data.data.photo_url}
        user_photo="/avatar/avatar1.jpg"
      />
      <div>
        <h3 className="text-lg font-semibold pb-2">Gastos recentes</h3>
        <ul className="flex flex-col gap-3">
          <Suspense fallback={<ExpenseCardSkeleton />}>
            {expensesHistory.data?.data.map((expense) => (
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
