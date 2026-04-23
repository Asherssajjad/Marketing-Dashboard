"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="flex-1 w-full bg-white">{children}</main>;
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F7FE] overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 bg-[#F4F7FE]">
        {children}
      </main>
    </div>
  );
}
