"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ExpenseRequest } from "@/types/requests";
import { useToast } from "@/hooks/use-toast";
import { navigate } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { moneyMask } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateTimePicker24h } from "@/components/ui/datetime-picker-24h";
import useSWR from "swr";
import { UserResponse } from "@/types/responses";
import fetcher from "@/lib/fetcher";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

const schema = yup.object().shape({
  amount: yup.string().required("Informe o valor do gasto"),
  description: yup.string().required("Informe uma descrição do gasto"),
  date: yup.string().required("Informe a data do gasto"),
  payer_id: yup.string().required("Informe quem pagou"),
  participants: yup
    .array()
    .min(1, "O gasto deve ter pelo menos 1 participante")
    .required("Informe os participantes deste gasto")
    .of(yup.string().required("O gasto deve ter pelo menos 1 participante")),
});

export default function Page() {
  const [isLoading, setLoading] = useState(false);
  const [date, setDate] = useState<Date>();
  const [amount, setAmount] = useState("");

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<ExpenseRequest>({
    resolver: yupResolver(schema),
  });

  const participants = useSWR<{ data: UserResponse[] }, Error>(
    "/api/users",
    fetcher
  );

  useEffect(() => {
    setValue("date", date?.toISOString() ?? "");
  }, [date, setValue]);

  const handleCheckboxChange = (checked: boolean, value: string) => {
    let participantsArray = getValues("participants") || [];
    if (checked) {
      participantsArray.push(value);
    } else {
      participantsArray = participantsArray.filter(
        (participant) => participant !== value
      );
    }
    setValue("participants", participantsArray);
  };

  if (participants.error) return <div>Failed to load</div>;

  const onSubmit: SubmitHandler<ExpenseRequest> = async (data) => {
    setLoading(true);
    const { amount, date, description, participants, payer_id } = data;
    console.log(data);

    const request: ExpenseRequest = {
      amount: amount.replaceAll(".", "").replace(",", "."),
      date,
      description,
      participants,
      payer_id,
    };

    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
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
        title: `Gasto criado com sucesso!`,
        duration: 1000,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

      console.log(data);
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Ocorreu algum erro! Tente novamente mais tarde.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="p-3">
      <div className="mb-7">
        <h1 className="text-3xl text-center">Cadastrar um Gasto</h1>
        <span className="text-gray-400 text-sm text-center">
          Preencha os campos abaixo para cadastrar um gasto
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Quando foi?</Label>
          <DateTimePicker24h date={date} setDate={setDate} />
          <input
            {...register("date", {
              value: date?.toISOString(),
            })}
            type="hidden"
          />
          <span className="text-sm text-red-600">{errors.date?.message}</span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Quem pagou?</Label>
          <Select
            {...register("payer_id")}
            onValueChange={(value) => setValue("payer_id", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione quem pagou a conta" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {participants.data?.data.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="text-sm text-red-600">
            {errors.payer_id?.message}
          </span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Descrição do gasto</Label>
          <Textarea {...register("description")} placeholder="Descrição" />
          <span className="text-sm text-red-600">
            {errors.description?.message}
          </span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Quanto foi gasto?</Label>
          <Input
            {...register("amount", {
              onChange: (e) => setAmount(moneyMask(e.target.value)),
            })}
            type="text"
            placeholder="Valor"
            value={amount}
          />
          <span className="text-sm text-red-600">{errors.amount?.message}</span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label>Entre quem será dividido a conta?</Label>

          <div className="grid grid-cols-2 gap-x-3">
            {participants.data
              ? participants.data.data.map((p) => (
                  <div key={p.id} className="flex items-center gap-2">
                    <Checkbox
                      key={p.id}
                      onCheckedChange={(e) => handleCheckboxChange(!!e, p.id)}
                    />
                    <Label>{p.name}</Label>
                  </div>
                ))
              : Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                ))}
          </div>
          <span className="text-sm text-red-600">
            {errors.participants?.message}
          </span>
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="text-white" /> : "Salvar gasto"}
        </Button>
      </form>
    </main>
  );
}
