"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { UserRequest } from "@/types/requests";
import { useToast } from "@/hooks/use-toast";
import { navigate } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";
import { avatarImages } from "@/lib/definitions";
import { useParams } from "next/navigation";

type Inputs = {
  user_name: string;
  user_image_index: string;
};

const schema = yup.object().shape({
  user_name: yup.string().required("Você deve informar seu nome"),
  user_image_index: yup.string().required("Você deve escolher um ícone"),
});

export default function Page() {
  const [icon, setIcon] = useState("Nenhum");
  const [isLoading, setLoading] = useState(false);

  const { toast } = useToast();
  const { code } = useParams<{ code: string }>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const { user_name, user_image_index } = data;
    const user_image = avatarImages[parseInt(user_image_index)].path;

    const request: UserRequest = {
      name: user_name,
      photo_url: user_image,
      invite_code: code,
    };

    try {
      const res = await fetch("/api/users", {
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
        title: `Bem vindo(a) ${user_name}`,
        description:
          "Você foi adicionado ao grupo e será redirecionado em breve.",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/dashboard");
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
  };

  return (
    <main className="p-3">
      <div className="mb-7">
        <h1 className="text-3xl text-center">Criar uma conta</h1>
        <span className="text-gray-400 text-sm text-center">
          Preencha as informações abaixo para criar uma conta
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Qual seu nome?</Label>
          <Input {...register("user_name")} type="text" placeholder="Nome" />
          <span className="text-sm text-red-600">
            {errors.user_name?.message}
          </span>
        </div>

        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Escolha um ícone</Label>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Escolher Imagem</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[calc(100%-30px)] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Escolha uma imagem</DialogTitle>
                  <DialogDescription>
                    Selecione uma das imagens abaixo para usar como ícone
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-wrap gap-3 justify-center">
                  {avatarImages.map((avatar, i) => (
                    <DialogClose key={i}>
                      <Label className="flex items-center gap-3">
                        <Input
                          {...register("user_image_index", {
                            onChange: (e) =>
                              setIcon(avatarImages[e.target.value].text),
                          })}
                          type="radio"
                          className="absolute opacity-0 w-0 h-0"
                          value={i}
                          required
                        />
                        <Image
                          src={avatar.path}
                          alt={avatar.text}
                          width={200}
                          height={200}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </Label>
                    </DialogClose>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <span className="text-gray-400 text-md">{icon}</span>
          </div>
          <span className="text-sm text-red-600">
            {errors.user_image_index?.message}
          </span>
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Spinner className="text-white" /> : "Criar conta"}
        </Button>
      </form>
    </main>
  );
}
