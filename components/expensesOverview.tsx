import Image from "next/image";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";

type ExpensesOverviewProps = {
  group_photo: string;
  user_photo: string;
  balance: string | undefined;
  debt: string | undefined;
  surplus: string | undefined;
};

export default function ExpensesOverview(props: ExpensesOverviewProps) {
  return (
    <div
      style={{ backgroundImage: `url(${props.group_photo})` }}
      className="max-w-screen-lg w-full bg-white rounded-lg shadow-md p-3 flex items-start space-x-4 bg-cover bg-center"
    >
      <div className="flex items-start space-x-4 bg-black bg-opacity-30 rounded-sm p-2 w-full">
        <div className="flex-shrink-0">
          <Image
            className="h-16 w-16 rounded-full"
            src={props.user_photo}
            alt="Profile Picture"
            width={64}
            height={64}
          />
        </div>
        <div>
          <div className="flex flex-col">
            <span className="text-sm font-regular text-gray-200">Total</span>
            <Suspense fallback={<Skeleton className="h-6 w-8" />}>
              <strong className="text-3xl font-semibold text-white">
                R$ {props.balance?.replace(".", ",")}
              </strong>
            </Suspense>
          </div>
          <div className="flex flex-col pt-3 pl-3">
            <Suspense fallback={<Skeleton className="h-2 w-full" />}>
              <span className="text-red-300">
                Você deve <strong>R$ {props.debt?.replace(".", ",")} </strong>
              </span>
            </Suspense>

            <Suspense fallback={<Skeleton className="h-2 w-full mt-4" />}>
              <span className="text-green-300">
                À receber <strong>R$ {props.surplus?.replace(".", ",")}</strong>
              </span>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
