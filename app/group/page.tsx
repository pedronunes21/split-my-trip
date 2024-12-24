import Image from "next/image";

export default function Group() {
    return (
        <div className="flex flex-col justify-center p-4 gap-3">
            <h3 className="text-lg font-semibold pb-2">Your groups</h3>
            <div>
                <ul className="flex flex-col gap-3">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <li key={index} className="flex items-start gap-4">
                            <div className="w-full h-16 rounded-sm bg-[url('/beach-bg.jpg')] bg-cover bg-center flex px-4 py-2">
                                <div className="bg-black bg-opacity-20 rounded-sm p-2 w-full">
                                    <h4 className="font-bold text-lg text-white mb-[-10px]">Praia dos Amigos</h4>
                                    <span className="text-sm text-gray-200">Criado em: 16/12/24</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}