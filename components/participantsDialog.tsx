import { DialogDescription, DialogTitle } from "./ui/dialog";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { UserResponse } from "@/types/responses";

export default function ParticipantsDialog() {
  const participants = useSWR<{ data: UserResponse[] }, Error>(
    "/api/users",
    fetcher
  );

  if (participants.error) return <div>Failed to load</div>;

  return (
    <main>
      <DialogTitle className="font-normal">Participantes</DialogTitle>
      <DialogDescription>Todos os participantes do grupo</DialogDescription>
      {participants.data ? (
        <div className="flex flex-col gap-2 pt-3">
          {participants.data.data.map((p) => (
            <li key={p.id} className="flex items-start gap-2">
              <Image
                className="h-8 w-8 rounded-full"
                src={p.photo_url}
                alt={p.name}
                width={32}
                height={32}
              />
              <span className="text-left">{p.name}</span>
            </li>
          ))}
        </div>
      ) : (
        <ParticipantSkeleton />
      )}
    </main>
  );
}

function ParticipantSkeleton() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[75px]" />
      </div>
    </div>
  );
}
