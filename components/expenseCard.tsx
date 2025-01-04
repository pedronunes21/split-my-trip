import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

type ExpenseCardProps = {
  user_profile: string;
  user_name: string;
  date: string;
  description: string;
  amount: string;
};

export function ExpenseCard(props: ExpenseCardProps) {
  const date = new Date(props.date);
  let dateString = "";

  if (date.getDate() === new Date().getDate()) {
    dateString = date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } else {
    dateString = date.toLocaleDateString("pt-BR", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    });
  }

  return (
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
          <h4 className="text-lg font-semibold m-0">{props.user_name}</h4>
          <span className="text-md text-gray-400 font-medium">
            {dateString}
          </span>
        </div>
        <div className="flex justify-between items-start w-full gap-2">
          <small className="text-sm text-gray-400 font-regular">
            {props.description}
          </small>
          <strong className="whitespace-nowrap text-green-400">
            R$ {props.amount.replace(".", ",")}
          </strong>
        </div>
      </div>
    </li>
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
