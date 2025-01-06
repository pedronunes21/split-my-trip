"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import { useState } from "react";
import { Spinner } from "./ui/spinner";
import { useRouter } from "next/navigation";

export default function PageError() {
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();
  function reloadPage() {
    setLoading(true);
    router.refresh();
    setTimeout(() => {
      setLoading(false);
    }, 15000);
  }
  return (
    <div className="flex items-center justify-center flex-col w-screen h-screen px-4">
      <div>
        <Image
          src="/error/error1.gif"
          alt="Erro1"
          width={165}
          height={292}
          priority
        />
      </div>
      <h2 className="text-2xl font-bold text-center pt-4">404</h2>
      <span className="text-md text-gray-300 text-center max-w-56 pb-3">
        Ocorreu algo de errado. Tente novamente mais tarde
      </span>
      <Button
        onClick={reloadPage}
        disabled={isLoading}
        className="bg-gray-200 text-gray-400"
      >
        {isLoading ? <Spinner className="text-gray-400" /> : "Recarregar"}
      </Button>
    </div>
  );
}
