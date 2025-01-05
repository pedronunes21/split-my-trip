import { InvitationResponse } from "@/types/responses";
import {
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "./ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "./ui/skeleton";
import { FaClipboard } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";

type InviteDialogProps = {
  shouldFetchInvite: boolean;
};

export default function InviteDialog(props: InviteDialogProps) {
  const { toast } = useToast();
  const invitation = useSWR<{ data: InvitationResponse }, Error>(
    props.shouldFetchInvite ? "/api/invitations" : null,
    fetcher
  );

  if (invitation.error) return <div>Failed to load</div>;
  const inviteLink = `http://localhost:3000/invite/${invitation.data?.data.invite_code}`;

  function writeToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Texto copiado!",
      duration: 1500,
    });
  }

  return (
    <DialogContent className="w-[calc(100%-30px)] rounded-md">
      <DialogHeader>
        <DialogTitle className="font-normal">Links de convite</DialogTitle>
        <DialogDescription>
          Compartilhe os links de convite abaixo para convidar seus amigos
        </DialogDescription>
        <div className="flex items-center justify-center py-2">
          {invitation.data ? (
            <QRCodeSVG
              value={inviteLink}
              title="Convite para o grupo | SplitMyTrip"
              size={256}
            />
          ) : (
            <Skeleton className="w-[256px] h-[256px]" />
          )}
        </div>
        {invitation.data ? (
          <div className="flex items-center justify-between">
            <span className="text-md underline underline-offset-4 text-gray-300">
              {inviteLink}
            </span>
            <button
              onClick={() => writeToClipboard(inviteLink)}
              className="h-6 w-6 flex items-center justify-center rounded-sm"
            >
              <FaClipboard className="text-gray-500" />
            </button>
          </div>
        ) : (
          <Skeleton className="w-full h-6" />
        )}
      </DialogHeader>
    </DialogContent>
  );
}
