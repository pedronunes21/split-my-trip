"use client";
import { ExpenseCard, ExpenseCardSkeleton } from "@/components/expenseCard";
import ExpensesOverview from "@/components/expensesOverview";
import ScreenLoading from "@/components/screenLoading";
import fetcher from "@/lib/fetcher";
import {
  ExpenseHistoryResponse,
  ExpensesOverviewResponse,
  GroupResponse,
  UserResponse,
} from "@/types/responses";
import { useState } from "react";
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
import LogoutDialog from "@/components/logoutDialog";
import PageError from "@/components/pageError";
import AccountError from "@/components/accountError";
import ExpenseDetailsDialog from "@/components/expenseDetailsDialog";
import { useCookies } from "next-client-cookies";

export default function Dashboard() {
  const [dialogType, setDialogType] = useState("");
  const cookies = useCookies();
  const pageSize = 10;

  const groups = useSWR<{ data: GroupResponse[] }, Error>(
    "/api/groups",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const user = useSWR<{ data: UserResponse[] }, Error>(
    "/api/users/me",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const expensesHistory = useSWR<{ data: ExpenseHistoryResponse[] }, Error>(
    `api/expenses/history?size=${pageSize}&number=1`,
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  const expensesOverview = useSWR<{ data: ExpensesOverviewResponse[] }, Error>(
    "api/expenses/overview?me=true",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );

  if (
    groups.error ||
    expensesHistory.error ||
    expensesOverview.error ||
    user.error
  )
    return <PageError />;

  if (!groups.data) return <ScreenLoading />;

  if (
    !groups.isLoading &&
    !user.isLoading &&
    (!groups.data.data.length || !user.data?.data.length)
  )
    return <AccountError />;

  return (
    <div className="flex flex-col justify-center p-4 gap-3">
      <div className="flex items-center justify-between py-4">
        <Dialog>
          <DropdownMenu>
            <div className="flex justify-between items-center w-full">
              <h3 className="text-2xl font-semibold">
                {groups.data.data[0].title}
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
                <DropdownMenuItem
                  onClick={() => setDialogType("expense_details")}
                >
                  Resumo
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setDialogType("sair")}>
                  Sair
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
              ) : dialogType == "sair" ? (
                <LogoutDialog />
              ) : dialogType == "expense_details" ? (
                <ExpenseDetailsDialog />
              ) : (
                <div></div>
              )}
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <ExpensesOverview
        balance={expensesOverview.data?.data[0].balance}
        debt={expensesOverview.data?.data[0].debt}
        surplus={expensesOverview.data?.data[0].surplus}
        group_photo={groups.data.data[0].photo_url}
        user_photo={user.data?.data[0].photo_url}
      />
      <div>
        <div className="flex items-center justify-between py-4">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold">Gastos recentes</h3>
            <Link href="/expense">
              <small>Ver todos</small>
            </Link>
          </div>
          <Link
            href="/expense/create"
            className="bg-gray-200 rounded-sm h-9 w-9 flex items-center justify-center"
          >
            <FaPlus className="text-gray-500" size={18} />
          </Link>
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
      </div>
    </div>
  );
}
