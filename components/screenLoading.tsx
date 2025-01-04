import { Spinner } from "./ui/spinner";

export default function ScreenLoading() {
  return (
    <div className="flex justify-center items-center h-screen w-full">
      <Spinner />
    </div>
  );
}
