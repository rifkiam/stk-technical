'use client';

import DesktopSidebar from "@/components/DesktopSidebar";
import MobileSidebar from "@/components/MobileSidebar";
import useWindowResize from "@/hooks/useWindowResize";
import clsxm from "@/lib/clsxm";
import { useSidebarStore } from "@/store/store";
import { ReactNode, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

// Custom layout for the "systems" folder
export default function SystemsLayout({ children }: { children: ReactNode }) {
    const { windowWidthSize } = useWindowResize();
    // const { showStatus, setShowStatus } = useSidebarStore();
    const [showStatus, setShowStatus] = useState(false);

    return (
        <div className={`lg:m-4 ${showStatus ? '' : 'mx-8 my-4'}`}>
            <div className={clsxm("md:flex md:flex-row", showStatus ? 'justify-between space-x-12' : 'space-x-4')}>
                <div className="w-max h-full">
                    {windowWidthSize && windowWidthSize > 1024 ? (
                        <DesktopSidebar setShowStatus={setShowStatus} showStatus={showStatus} />
                    )
                    : (
                        <MobileSidebar setShowStatus={setShowStatus} showStatus={showStatus} className={!showStatus ? 'hidden' : ''} />
                    )}
                </div>
                <div className="w-full py-6">
                    {children}
                </div>
            </div>
        </div>
    );
}