import { InvitationResponse } from "@/types/responses";
import { DialogDescription, DialogTitle } from "./ui/dialog";
import { QRCodeSVG } from "qrcode.react";
import useSWR from "swr";
import fetcher from "@/lib/fetcher";
import { Skeleton } from "./ui/skeleton";
import { FaArrowsRotate, FaClipboard } from "react-icons/fa6";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function InviteDialog() {
  const [shouldFetch, setShouldFetch] = useState(true);
  const { toast } = useToast();

  const invitation = useSWR<{ data: InvitationResponse }, Error>(
    shouldFetch ? "/api/invitations" : null,
    fetcher
  );

  function writeToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link de convite copiado!",
      duration: 1500,
    });
  }

  const inviteLink = `https://www.splitmytrip.com/invite/${invitation.data?.data.invite_code}`;

  async function generateInvitation() {
    setShouldFetch(false);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: data.error,
        });
        return;
      }

      setShouldFetch(true);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Ocorreu algum erro! Tente novamente mais tarde.",
      });
    }
  }

  return (
    <main>
      <div className="flex items-center justify-center flex-col gap-2 pt-4">
        <DialogTitle className="font-normal">Links de convite</DialogTitle>
        <button onClick={generateInvitation}>
          <FaArrowsRotate />
        </button>
      </div>
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
        <div className="flex items-center justify-center">
          <span className="text-md underline underline-offset-4 text-gray-400">
            {invitation.data ? invitation.data.data.invite_code : ""}
          </span>
          <button
            onClick={() => writeToClipboard(inviteLink)}
            className="h-6 w-6 flex items-center justify-center rounded-sm"
          >
            <FaClipboard className="text-gray-400" />
          </button>
        </div>
      ) : (
        <Skeleton className="w-full h-6" />
      )}
    </main>
  );
}
