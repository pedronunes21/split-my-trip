import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FaBarsStaggered } from "react-icons/fa6";

export default function Home() {
  return (
    <div className="flex items-center justify-between gap-4 p-2">
      <DropdownMenu>
        <div className="flex justify-between items-center w-full">
          <h1 className="font-semibold text-2xl text-slate-500">SplitMyTrip</h1>
          <DropdownMenuTrigger className="bg-gray-200 rounded-sm h-9 w-9 flex items-center justify-center">
            <FaBarsStaggered className="text-gray-500" size={18} />
          </DropdownMenuTrigger>
        </div>
        <DropdownMenuContent>
          <DropdownMenuLabel>Opções</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/dashboard">Entrar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/group/create">Criar grupo</Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
