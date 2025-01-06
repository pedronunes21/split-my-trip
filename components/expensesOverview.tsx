import Image from "next/image";
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
      style={{ backgroundImage: `url('${props.group_photo}')` }}
      className="max-w-screen-lg w-full rounded-lg shadow-md p-3 flex items-start space-x-4 bg-cover bg-center"
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
            {props.balance ? (
              <strong className="text-3xl font-semibold text-white">
                R$ {parseFloat(props.balance).toFixed(2).replace(".", ",")}
              </strong>
            ) : (
              <Skeleton className="h-6 w-8" />
            )}
          </div>
          <div className="flex flex-col pt-3 pl-3">
            {props.debt ? (
              <span className="text-red-300">
                Você deve{" "}
                <strong>
                  R$ {parseFloat(props.debt).toFixed(2).replace(".", ",")}{" "}
                </strong>
              </span>
            ) : (
              <Skeleton className="h-2 w-full" />
            )}

            {props.surplus ? (
              <span className="text-green-300">
                À receber{" "}
                <strong>
                  R$ {parseFloat(props.surplus).toFixed(2).replace(".", ",")}
                </strong>
              </span>
            ) : (
              <Skeleton className="h-2 w-full mt-4" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
