"use client";

import clsxm from "@/lib/clsxm";
import { navigationItems, secondaryNavigationItems } from "@/navigation/nav-items";
import Image from "next/image";
import { IoIosArrowForward } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

interface MobileSidebarProps {
    setShowStatus: (value: boolean) => void;
    showStatus: boolean;
    className?: string;
}

export default function MobileSidebar({
    setShowStatus,
    showStatus,
    className
}: MobileSidebarProps) {
    return (
        showStatus
        ? (
            <div className={clsxm("w-screen h-screen bg-blue-500 mx-auto text-center", className)}>
                <div className="w-full flex flex-col place-items-center">
                    <div className="h-max py-10">
                        <Image src={'/stk.png'} alt="stk" className="object-cover" width={100} height={100} />
                    </div>
                    {navigationItems.map((item, index) => (
                        <div key={index} className="w-full flex flex-row px-4 py-4 justify-center items-center gap-4 cursor-pointer text-white hover:text-black hover:bg-white transition duration-150">
                            <item.icon />
                            {item.name}
                        </div>
                    ))}
                    {secondaryNavigationItems.map((item, index) => (
                        <div key={index} className="w-full flex flex-row px-4 py-4 justify-center items-center gap-4 cursor-pointer text-white hover:text-black hover:bg-white transition duration-150">
                            <item.icon />
                            {item.name}
                        </div>
                    ))}
                </div>
                <div className="w-full place-items-center pt-8">
                    <RxCross2
                        className="justify-center items-center w-8 h-8 rounded-full"
                        color="white"
                        onClick={() => setShowStatus(false)}
                    />
                </div>
            </div>
        )
        : (
            <IoIosArrowForward
                className="h-6 w-6 mt-6"
                color="black"
                onClick={() => setShowStatus(true)}
            />
        )
    )
}