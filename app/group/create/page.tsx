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
import { GroupRequest } from "@/types/requests";
import { useToast } from "@/hooks/use-toast";
import { navigate } from "@/app/actions";
import { Spinner } from "@/components/ui/spinner";

const groupBanners = [
  {
    path: "/group_banner/beach-bg.jpg",
    text: "Imagem 1",
  },
  {
    path: "/group_banner/beach-bg.jpg",
    text: "Imagem 2",
  },
];

const avatarImages = [
  {
    path: "/avatar/avatar1.jpg",
    text: "Ícone 1",
  },
  {
    path: "/avatar/avatar1.jpg",
    text: "Ícone 2",
  },
  {
    path: "/avatar/avatar1.jpg",
    text: "Ícone 3",
  },
  {
    path: "/avatar/avatar1.jpg",
    text: "Ícone 4",
  },
  {
    path: "/avatar/avatar1.jpg",
    text: "Ícone 5",
  },
];

type Inputs = {
  group_title: string;
  group_banner_index: string;
  user_name: string;
  user_image_index: string;
};

const schema = yup.object().shape({
  group_title: yup.string().required("Você deve informar o título do grupo"),
  group_banner_index: yup.string().required("Você deve escolher uma imagem"),
  user_name: yup.string().required("Você deve informar seu nome"),
  user_image_index: yup.string().required("Você deve escolher um ícone"),
});

export default function Page() {
  const [banner, setBanner] = useState("Nenhuma");
  const [icon, setIcon] = useState("Nenhum");
  const [isLoading, setLoading] = useState(false);

  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setLoading(true);
    const { group_title, group_banner_index, user_name, user_image_index } =
      data;
    const group_banner = groupBanners[parseInt(group_banner_index)].path;
    const user_image = avatarImages[parseInt(user_image_index)].path;

    const request: GroupRequest = {
      title: group_title,
      photo_url: group_banner,
      user: {
        name: user_name,
        photo_url: user_image,
      },
    };

    try {
      const raw = await fetch("/api/groups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      const res = await raw.json();

      if (res instanceof Error) {
        toast({
          variant: "destructive",
          title: res.message,
        });
        return;
      }

      toast({
        title: "Grupo criado com sucesso!",
        description: "Você será redirecionado em breve.",
        duration: 2000,
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

      console.log(res);
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
        <h1 className="text-3xl text-center">Criar um grupo</h1>
        <span className="text-gray-400 text-sm text-center">
          Preencha as informações abaixo para criar o grupo
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Dê um nome para o grupo</Label>
          <Input
            {...register("group_title")}
            type="text"
            placeholder="Título"
          />
          <span className="text-sm text-red-600">
            {errors.group_title?.message}
          </span>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Escolha uma imagem para o grupo</Label>
          <div className="flex items-center gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Escolher Imagem</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] w-[calc(100%-30px)] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Escolha uma imagem</DialogTitle>
                  <DialogDescription>
                    Selecione uma das imagens abaixo para usar de foto do grupo
                  </DialogDescription>
                </DialogHeader>
                <div>
                  {groupBanners.map((banner, i) => (
                    <DialogClose key={i} className="w-full">
                      <Label className="flex items-center gap-3">
                        <Input
                          {...register("group_banner_index", {
                            onChange: (e) =>
                              setBanner(groupBanners[e.target.value].text),
                          })}
                          type="radio"
                          className="absolute opacity-0 w-0 h-0"
                          value={i}
                          required
                        />
                        <Image
                          src={banner.path}
                          alt={banner.text}
                          width={500}
                          height={300}
                          className="w-full h-20 object-cover rounded-lg"
                        />
                      </Label>
                    </DialogClose>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            <span className="text-gray-400 text-md">{banner}</span>
          </div>
          <span className="text-sm text-red-600">
            {errors.group_banner_index?.message}
          </span>
        </div>
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
          {isLoading ? <Spinner className="text-white" /> : "Criar grupo"}
        </Button>
      </form>
    </main>
  );
}
