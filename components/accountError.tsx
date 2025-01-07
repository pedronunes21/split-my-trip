import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { navigate } from "@/app/actions";

export default function AccountError() {
  const [isLoading, setLoading] = useState(false);

  function refreshPage() {
    location.reload();
  }

  async function removeCookies() {
    setLoading(true);
    document.cookie = "";
    navigate("/");
    setLoading(false);
  }

  return (
    <Dialog open={true}>
      <DialogContent className="w-[calc(100%-30px)] rounded-md">
        <DialogHeader>
          <DialogTitle className="font-normal">Ocorreu algum erro</DialogTitle>
          <DialogDescription className="py-4">
            Parece que ocorreu algum erro com sua conta. Se você está tentando
            acessar uma conta válida em um grupo válido, por favor reinicie a
            página para tentar novamente. Caso contrário, clique no botão abaixo
            para apagar seus dados e poder criar uma nova conta ou ser convidado
            novamente.
          </DialogDescription>
          <div className="flex justify-between items-center gap-2">
            <Button
              onClick={removeCookies}
              className="bg-red-600 w-full hover:bg-red-700"
            >
              {isLoading ? <Spinner className="text-white" /> : "Apagar dados"}
            </Button>
            <Button
              className="bg-gray-200 text-gray-500 w-24 hover:bg-gray-300"
              onClick={refreshPage}
            >
              Reiniciar
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
