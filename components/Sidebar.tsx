"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Briefcase, 
  CheckSquare, 
  CreditCard, 
  BarChart2, 
  Settings, 
  Zap, 
  Globe, 
  ShieldCheck,
  Cpu
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const mainNav = [
    { name: "Intelligence", href: "/", icon: <LayoutDashboard size={18} /> },
    { name: "Partners", href: "/clients", icon: <Users size={18} /> },
    { name: "Content Ops", href: "/content", icon: <FileText size={18} /> },
    { name: "Build Pipeline", href: "/projects", icon: <Briefcase size={18} /> },
    { name: "Operations", href: "/tasks", icon: <CheckSquare size={18} /> },
    { name: "Financials", href: "/payments", icon: <CreditCard size={18} /> },
    { name: "Analytics", href: "/reports", icon: <BarChart2 size={18} /> },
    { name: "Security Protocol", href: "/login", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col shrink-0 shadow-2xl shadow-indigo-100/10 z-20 relative">
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-gray-100 to-transparent"></div>
      
      {/* Brand Identity */}
      <div className="h-24 flex items-center px-8 gap-4 border-b border-gray-50 bg-gray-50/20">
        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50 transition-transform hover:rotate-12">
          <Zap size={22} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-gray-900 leading-none tracking-tighter italic">AXION</h1>
          <p className="text-[9px] text-gray-400 font-black tracking-[0.2em] uppercase mt-1 opacity-60">Control Nexus</p>
        </div>
      </div>

      {/* Navigation Ecosystem */}
      <div className="flex-1 py-10 px-6 flex flex-col gap-2 overflow-y-auto no-scrollbar">
        <div className="mb-4 px-4 text-[9px] font-black text-gray-300 uppercase tracking-widest italic">Core Modules</div>
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest italic group
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 translate-x-1" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100"
                }`}
            >
              <div className={`${isActive ? "text-white" : "text-gray-300 group-hover:text-indigo-600"} transition-colors`}>
                {item.icon}
              </div>
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Infrastructure Panel */}
      <div className="p-6 border-t border-gray-50 bg-gray-50/30 space-y-4">
        <Link
          href="/settings"
          className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest italic group
            ${pathname === "/settings" 
              ? "bg-gray-900 text-white shadow-xl" 
              : "text-gray-400 hover:text-gray-900 hover:bg-white hover:shadow-lg hover:shadow-gray-200/40"
            }`}
        >
          <Settings size={18} className="text-gray-400 group-hover:text-gray-900" />
          Protocol Config
        </Link>

        <div className="bg-white rounded-[24px] p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-50 rounded-full translate-x-8 -translate-y-8 group-hover:bg-emerald-100 transition-colors"></div>
           <div className="flex items-center gap-2 mb-3 relative z-10">
              <Cpu size={14} className="text-emerald-500 animate-pulse" />
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">System Active</p>
           </div>
           <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner relative z-10">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 w-[88%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
           </div>
           <p className="text-[9px] text-gray-400 font-bold mt-2 uppercase tracking-tighter relative z-10">Throughput: 88.4% Optimal</p>
        </div>
        
        <div className="flex items-center justify-between px-2 pt-2">
           <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest italic">
              <ShieldCheck size={14} /> Encrypted
           </div>
           <span className="text-[8px] font-black text-gray-200">v4.0.2-BETA</span>
        </div>
      </div>
    </aside>
  );
}
