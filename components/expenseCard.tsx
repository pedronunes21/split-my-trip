import Image from "next/image";

type ExpenseCardProps = {
  user_profile: string;
  user_name: string;
  date: string;
  description: string;
  amount: string;
};

export default function ExpenseCard(props: ExpenseCardProps) {
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
          <span className="text-md text-gray-400 font-medium">9:35AM</span>
        </div>
        <div className="flex justify-between items-start w-full">
          <small className="text-sm text-gray-400 font-regular">
            {props.description}
          </small>
          <strong className="whitespace-nowrap text-green-400">
            R$ {props.amount}
          </strong>
        </div>
      </div>
    </li>
  );
}
