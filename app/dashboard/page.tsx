import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Dashboard() {
    return (
        <div className="flex flex-col justify-center p-4 gap-3">
            <div className="max-w-screen-lg w-full bg-white rounded-lg shadow-md p-3 flex items-start space-x-4">
                <div className="flex-shrink-0">
                    <Image
                        className="h-16 w-16 rounded-full"
                        src="/avatar.webp"
                        alt="Profile Picture"
                        width={64}
                        height={64}
                    />
                </div>
                <div>
                    <div className="flex flex-col">
                        <span className="text-sm font-regular text-gray-400">Total Balance</span>
                        <strong className="text-3xl font-semibold">R$ 36,90</strong>
                    </div>
                    <div className="flex flex-col pt-3 pl-3">
                        <span className="text-red-400">
                            You owe <strong>R$ 12,55 </strong>
                        </span>
                        <span className="text-green-400">
                            You'll get <strong>R$ 49,35</strong>
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold pb-2">Recent transactions</h3>
                <ul className="flex flex-col">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <div>
                                <Image
                                    className="h-12 w-12 rounded-full"
                                    src="/avatar.webp"
                                    alt="Profile Picture"
                                    width={64}
                                    height={64}
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-start">
                                    <h4 className="text-lg font-semibold m-0">Friend 1</h4>
                                    <span className="text-md text-gray-400 font-medium">9:35AM</span>
                                </div>
                                <div className="flex justify-between items-start">
                                    <small className="text-sm text-gray-400 font-regular">A brief description about the expense.</small>
                                    <strong className="whitespace-nowrap text-green-400">R$ 12,50</strong>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            <nav className="flex items-center justify-between gap-2 w-[calc(100%-40px)] rounded-full bg-white shadow-sm fixed bottom-3 p-2 h-16 left-[50%] translate-x-[-50%] max-w-[450px]">
                <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">1</Button>
                <Button className="rounded-full w-full h-full bg-purple-400 shadow-none text-white">2</Button>
                <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">3</Button>
                <Button className="rounded-full w-full h-full bg-white shadow-none text-gray-300">4</Button>
            </nav>
        </div>
    )
}