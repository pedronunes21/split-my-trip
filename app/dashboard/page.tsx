"use client";
import { ExpenseCard, ExpenseCardSkeleton } from "@/components/expenseCard";
import ExpensesOverview from "@/components/expensesOverview";
import ScreenLoading from "@/components/screenLoading";
import fetcher from "@/lib/fetcher";
import {
  ExpenseHistoryResponse,
  ExpensesOverviewResponse,
  GroupResponse,
} from "@/types/responses";
import { Suspense, useState } from "react";
import useSWR from "swr";
import { FaPlus, FaBarsStaggered } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import InviteDialog from "@/components/inviteDialog";
import ParticipantsDialog from "@/components/participantsDialog";
import Link from "next/link";

export default function Dashboard() {
  const [dialogType, setDialogType] = useState("");
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

  return (
    <div className="flex flex-col justify-center p-4 gap-3">
      <div className="flex items-center justify-between py-4">
        <Dialog>
          <DropdownMenu>
            <div className="flex justify-between items-center w-full">
              <h3 className="text-2xl font-semibold">
                {groups.data.data.title}
              </h3>
              <DropdownMenuTrigger className="bg-gray-200 rounded-sm h-9 w-9 flex items-center justify-center">
                <FaBarsStaggered className="text-gray-500" size={18} />
              </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent>
              <DropdownMenuLabel>Opções</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DialogTrigger>
                <DropdownMenuItem onClick={() => setDialogType("convidar")}>
                  Convidar
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setDialogType("participantes")}
                >
                  Participantes
                </DropdownMenuItem>
              </DialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <DialogContent className="w-[calc(100%-30px)] rounded-md">
            <DialogHeader>
              {dialogType == "convidar" ? (
                <InviteDialog />
              ) : dialogType == "participantes" ? (
                <ParticipantsDialog />
              ) : (
                <div></div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <ExpensesOverview
        balance={expensesOverview.data?.data.balance}
        debt={expensesOverview.data?.data.debt}
        surplus={expensesOverview.data?.data.surplus}
        group_photo={groups.data.data.photo_url}
        user_photo="/avatar/avatar1.jpg"
      />
      <div>
        <div className="flex items-center justify-between py-4">
          <h3 className="text-lg font-semibold pb-2">Gastos recentes</h3>
          <Link
            href="/expense/create"
            className="bg-gray-200 rounded-sm h-9 w-9 flex items-center justify-center"
          >
            <FaPlus className="text-gray-500" size={18} />
          </Link>
        </div>

        <ul className="flex flex-col gap-3">
          <Suspense fallback={<ExpenseCardSkeleton />}>
            {expensesHistory.data?.data.map((expense) => (
              <ExpenseCard
                key={expense.id}
                expense_id={expense.id}
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
    </div>
  );
}
