"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, Users, FileText, Briefcase, CheckSquare, CreditCard, BarChart2, Settings, Zap, LogOut } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const mainNav = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Clients", href: "/clients", icon: <Users size={20} /> },
    { name: "Content", href: "/content", icon: <FileText size={20} /> },
    { name: "Projects", href: "/projects", icon: <Briefcase size={20} /> },
    { name: "Tasks", href: "/tasks", icon: <CheckSquare size={20} /> },
    { name: "Payments", href: "/payments", icon: <CreditCard size={20} />, adminOnly: true },
    { name: "Reports", href: "/reports", icon: <BarChart2 size={20} />, adminOnly: true },
  ].filter(item => !item.adminOnly || user?.role === "ADMIN");

  return (
    <aside className="w-[260px] bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-sm z-20">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
          <Zap size={18} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-bold text-xl text-gray-900 leading-tight">AXION</h1>
          <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase">SaaS Platform</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-4 flex flex-col gap-1 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm
                ${isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
            >
              <div className={`${isActive ? "text-indigo-600" : "text-gray-400"}`}>
                {item.icon}
              </div>
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all font-medium text-sm"
        >
          <Settings size={20} className="text-gray-400" />
          Settings
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all font-medium text-sm"
        >
          <LogOut size={20} className="text-gray-400 group-hover:text-rose-600" />
          Logout
        </button>
        <div className="bg-indigo-50 rounded-xl p-4 mt-4">
          <p className="text-xs font-bold text-indigo-900 mb-2">PLAN USAGE</p>
          <div className="h-1.5 w-full bg-indigo-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 w-[75%] rounded-full"></div>
          </div>
          <p className="text-[10px] text-gray-500 mt-2">75% of client slots used</p>
        </div>
      </div>
    </aside>
  );
}
