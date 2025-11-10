import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarStore {
    showStatus: boolean;
    setShowStatus: (status: boolean) => void;
}

export const useSidebarStore = create<SidebarStore>()(
    persist(
        (set) => ({
            showStatus: false,
            setShowStatus: (status: boolean) => set({ showStatus: status }),
        }),
        {
            name: "sidebar-storage",
        }
    )
);