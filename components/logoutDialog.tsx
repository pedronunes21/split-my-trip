import { useToast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { DialogDescription, DialogTitle } from "./ui/dialog";
import { navigate } from "@/app/actions";
import { useState } from "react";
import { Spinner } from "./ui/spinner";

export default function LogoutDialog() {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(false);

  async function exitGroup() {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "DELETE",
      });
      console.log(res);
      const data = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: data.error,
        });
        return;
      }

      toast({
        title: "Conta excluída com sucesso :(",
        description: "Você será redirecionado em breve ;-;",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Ocorreu algum erro! Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <DialogTitle>Tem certeza que quer sair?</DialogTitle>
      <DialogDescription>
        Essa opção não é reversível. Uma vez que você saia do grupo, sua conta
        será deleta e sua informações apagadas. Você pode entrar novamente
        através de um link de convite, porém com uma nova conta.
      </DialogDescription>
      <Button className="bg-red-600" disabled={isLoading} onClick={exitGroup}>
        {isLoading ? (
          <Spinner className="text-white" />
        ) : (
          "Sim, eu sei o que estou fazendo"
        )}
      </Button>
    </div>
  );
}
