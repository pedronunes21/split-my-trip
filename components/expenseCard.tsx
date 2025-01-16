import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { ExpenseParticipants } from "@/types/responses";
import { useState } from "react";
import { FaEllipsis } from "react-icons/fa6";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import DeleteExpenseDialog from "./deleteExpenseDialog";

type ExpenseCardProps = {
  expense_id: string;
  user_profile: string;
  user_name: string;
  date: string;
  description: string;
  amount: string;
  created_by: string;
  active_user: string | undefined;
};

export function ExpenseCard(props: ExpenseCardProps) {
  const [shouldFetch, setShouldFetch] = useState(false);
  const [dialogType, setDialogType] = useState("");
  const [dropdownDialog, setDropdownDialog] = useState(false);
  const date = new Date(props.date);
  let compactDate = "";
  const completeDate = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date.getDate() === new Date().getDate()) {
    compactDate = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    compactDate = date.toLocaleDateString("pt-BR", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  }

  const participants = useSWR<{ data: ExpenseParticipants[] }, Error>(
    shouldFetch
      ? `/api/expenses/participants?expense_id=${props.expense_id}`
      : null,
    fetcher
  );

  if (participants.error) return <div>Failed to load</div>;

  return (
    <Dialog>
      <DialogTrigger
        onClick={() => {
          setShouldFetch(true);
        }}
      >
        <li className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Image
              className="h-12 w-12 rounded-full"
              src={props.user_profile}
              alt={props.user_name}
              width={64}
              height={64}
            />
          </div>
          <div className="w-full">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold m-0 text-left">
                {props.user_name}
              </h4>
              <span className="text-md text-gray-400 font-medium">
                {compactDate}
              </span>
            </div>
            <div className="flex justify-between items-start w-full gap-2">
              <small className="text-sm text-gray-400 font-regular text-left overflow-hidden whitespace-nowrap text-ellipsis w-[190px]">
                {props.description}
              </small>
              <strong className="whitespace-nowrap text-green-400">
                R$ {parseFloat(props.amount).toFixed(2).replace(".", ",")}
              </strong>
            </div>
          </div>
        </li>
      </DialogTrigger>
      <DialogContent className="w-[calc(100%-30px)] rounded-md">
        <DialogHeader>
          <DialogTitle className="font-normal">Detalhes do Gasto</DialogTitle>
          <div className="flex items-start gap-4 pt-4">
            <div className="flex-shrink-0">
              <Image
                className="h-12 w-12 rounded-full"
                src={props.user_profile}
                alt={props.user_name}
                width={64}
                height={64}
              />
            </div>
            <div className="flex flex-col items-start justify-start w-full">
              <div className="flex justify-between items-center w-full">
                <h4 className="text-lg font-semibold m-0">{props.user_name}</h4>
                <Dialog
                  open={dropdownDialog}
                  onOpenChange={(open) => setDropdownDialog(open)}
                >
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <FaEllipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DialogTrigger>
                        {props.active_user &&
                          props.active_user == props.created_by && (
                            <DropdownMenuItem
                              onClick={() => setDialogType("delete")}
                            >
                              Excluir
                            </DropdownMenuItem>
                          )}
                      </DialogTrigger>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DialogContent className="w-[calc(100%-30px)] rounded-md">
                    {dialogType == "delete" ? (
                      <DeleteExpenseDialog
                        setDialog={setDropdownDialog}
                        id={props.expense_id}
                      />
                    ) : (
                      ""
                    )}
                  </DialogContent>
                </Dialog>
              </div>
              <span className="text-gray-400 text-sm">{completeDate}</span>
            </div>
          </div>
          <DialogDescription className="py-4">
            {props.description}
          </DialogDescription>
          <div className="flex items-start flex-col gap-3">
            <h5>Participantes</h5>
            <ul className="flex flex-col items-start gap-2 pl-4 w-full">
              {participants.data ? (
                participants.data.data.map((p) => (
                  <li key={p.user_id} className="flex items-start gap-2 w-full">
                    <Image
                      className="h-6 w-6 rounded-full"
                      src={p.user_photo}
                      alt={p.user_name}
                      width={32}
                      height={32}
                    />
                    <div className="flex justify-between w-full">
                      <span className="text-left">{p.user_name}</span>
                      <small className="whitespace-nowrap">
                        R${" "}
                        {(
                          parseFloat(props.amount) /
                          participants.data!.data.length
                        )
                          .toFixed(2)
                          .replace(".", ",")}
                      </small>
                    </div>
                  </li>
                ))
              ) : (
                <ParticipantSkeleton />
              )}
            </ul>
          </div>
          <div className="flex justify-end items-end">
            Total:&nbsp;R$&nbsp;
            <span>
              <span className="text-3xl font-bold">
                {parseFloat(props.amount).toFixed(2).replace(".", ",")}
              </span>
            </span>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export function ExpenseCardSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[75px]" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    </div>
  );
}

function ParticipantSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-6 w-6 rounded-full" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}
