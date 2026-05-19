"use client";

import { createContext, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const SidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isOpen, setIsOpen] = useState(false);

  if (isLoginPage) {
    return <main className="flex-1 w-full bg-white">{children}</main>;
  }

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden relative">
        {/* Sidebar Container */}
        <div 
          className={`
            fixed inset-y-0 left-0 z-50 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out shrink-0
            ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <Sidebar />
        </div>

        {/* Overlay Backdrop */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#F4F7FE] overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarContext.Provider>
  );
}
