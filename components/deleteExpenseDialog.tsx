import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Spinner } from "./ui/spinner";
import { useToast } from "@/hooks/use-toast";

type DeleteExpenseDialogProps = {
  id: string;
  setDialog: Dispatch<SetStateAction<boolean>>;
};

export default function DeleteExpenseDialog(props: DeleteExpenseDialogProps) {
  const [isLoading, setLoading] = useState(false);
  const { toast } = useToast();

  async function deleteExpense() {
    setLoading(true);
    try {
      const res = await fetch(`/api/expenses?id=${props.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          variant: "destructive",
          title: data.error,
        });
        return;
      }

      toast({
        title: "Gasto excluído com sucesso!",
        duration: 2000,
      });

      location.reload();
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
    <DialogHeader>
      <DialogTitle>Deseja excluir este gasto?</DialogTitle>
      <DialogDescription>
        Confirme abaixo que tem certeza que deseja excluir este gasto.
      </DialogDescription>
      <div className="flex justify-between items-center gap-2">
        <Button
          onClick={deleteExpense}
          className="bg-red-600 w-full hover:bg-red-700"
        >
          {isLoading ? <Spinner className="text-white" /> : "Excluir"}
        </Button>
        <Button
          className="bg-gray-200 text-gray-500 w-24 hover:bg-gray-300"
          onClick={() => props.setDialog(false)}
        >
          Cancelar
        </Button>
      </div>
    </DialogHeader>
  );
}
