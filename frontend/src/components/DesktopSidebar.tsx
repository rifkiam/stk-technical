"use client";

import Image from "next/image";
import { useState } from "react";
import { BiGridAlt } from "react-icons/bi";
import { FaFolder } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { navigationItems, secondaryNavigationItems } from "@/navigation/nav-items";
import clsxm from "@/lib/clsxm";
import Link from "next/link";

interface DesktopSidebarProps {
    setShowStatus: (value: boolean) => void;
    showStatus: boolean;
    className?: string;
}

export default function DesktopSidebar({
    setShowStatus,
    showStatus,
    className
}: DesktopSidebarProps) {
    return (
        showStatus
        ? (
            <div className={clsxm("rounded-3xl w-72 xl:w-96 h-full bg-blue-500 p-6 space-y-6", className)}>
                <div className="flex flex-row justify-between items-center pb-4">
                    <Link href="/systems">
                        <div className="h-max">
                            <Image src={'/stk.png'} alt="stk" className="object-cover" width={100} height={100} />
                        </div>
                    </Link>
                    <IoIosArrowBack
                        className="h-8 w-8"
                        color="white"
                        onClick={() => setShowStatus(false)}
                    />
                </div>
                <div className="bg-blue-400 rounded-2xl w-full flex flex-col overflow-clip">
                    {navigationItems.map((item, index) => (
                        <Link key={index} href={`/systems${item.t}`}>
                            <div className="flex flex-row px-4 py-4 items-center gap-4 cursor-pointer text-white hover:text-black hover:bg-white transition duration-150">
                                <item.icon />
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
                <div className="w-full flex flex-col rounded-2xl overflow-clip">
                    {secondaryNavigationItems.map((item, index) => (
                        <Link key={index} href={`/systems${item.t}`}>
                            <div className="flex flex-row px-4 py-4 items-center gap-4 cursor-pointer text-white hover:text-black hover:bg-white transition duration-150">
                                <item.icon />
                                {item.name}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        )
        : (
            <IoIosArrowForward
                className="h-8 w-8 mt-6"
                color="gray"
                onClick={() => setShowStatus(true)}
            />
        )
    )
}