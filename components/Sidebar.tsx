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
  Cpu,
  Terminal,
  Activity,
  Layers,
  ArrowUpRight
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
    <aside className="w-[300px] bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 z-40 relative group overflow-hidden">
      
      {/* Dynamic Background Effects */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-indigo-600/10 via-transparent to-transparent -z-10"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl -z-10 animate-pulse"></div>

      {/* Brand Identity / Command Center Logo */}
      <div className="h-28 flex items-center px-10 gap-5 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-900/50 ring-4 ring-indigo-500/20 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
          <Zap size={28} fill="currentColor" />
        </div>
        <div>
          <h1 className="font-black text-2xl text-white leading-none tracking-tighter italic uppercase group-hover:tracking-wider transition-all duration-700">AXION</h1>
          <p className="text-[10px] text-indigo-400/60 font-black tracking-[0.3em] uppercase mt-2 italic">Command Intel</p>
        </div>
      </div>

      {/* Navigation Ecosystem Grid */}
      <div className="flex-1 py-12 px-8 flex flex-col gap-3 overflow-y-auto no-scrollbar">
        <div className="flex items-center gap-3 mb-6 px-4">
           <Terminal size={12} className="text-slate-600" />
           <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">System Modules</span>
        </div>
        
        {mainNav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 font-black text-[11px] uppercase tracking-[0.15em] italic group/item relative overflow-hidden
                ${isActive 
                  ? "bg-indigo-600 text-white shadow-2xl shadow-indigo-900/40 translate-x-2" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent hover:border-slate-700/50"
                }`}
            >
              <div className={`${isActive ? "text-white" : "text-slate-600 group-hover/item:text-indigo-400"} transition-colors duration-300`}>
                {item.icon}
              </div>
              <span className="relative z-10">{item.name}</span>
              {isActive ? (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white] animate-pulse"></div>
              ) : (
                <ArrowUpRight size={14} className="ml-auto opacity-0 -translate-x-2 group-hover/item:opacity-100 group-hover/item:translate-x-0 transition-all duration-500 text-slate-700" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Infrastructure & Intelligence Panel */}
      <div className="p-8 border-t border-slate-800/50 bg-slate-900/60 backdrop-blur-xl space-y-6">
        <Link
          href="/settings"
          className={`flex items-center gap-5 px-6 py-4 rounded-[22px] transition-all duration-300 font-black text-[11px] uppercase tracking-widest italic group/set border border-slate-800
            ${pathname === "/settings" 
              ? "bg-slate-100 text-slate-900 shadow-xl" 
              : "text-slate-500 hover:text-white hover:bg-slate-800"
            }`}
        >
          <Settings size={18} className="text-slate-600 group-hover/set:rotate-90 transition-transform duration-700" />
          Protocol CFG
        </Link>

        <div className="bg-slate-800/40 rounded-[30px] p-6 border border-slate-800 relative group/stat cursor-pointer hover:bg-slate-800/60 transition-colors">
           <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <Activity size={18} className="text-emerald-500 animate-[pulse_1s_infinite]" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-white uppercase tracking-widest italic leading-none">Global Sync</p>
                    <p className="text-[8px] text-emerald-500 uppercase tracking-widest mt-1 opacity-60">Status: Peak</p>
                 </div>
              </div>
              <Layers size={14} className="text-slate-700 group-hover/stat:text-indigo-400 transition-colors" />
           </div>
           
           <div className="space-y-2.5">
              <div className="flex justify-between items-end px-1">
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Load Capacity</span>
                 <span className="text-[10px] font-black text-emerald-500 italic">94.8%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden shadow-inner flex">
                 <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 w-[94.8%] rounded-full shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all duration-1000"></div>
              </div>
           </div>
        </div>
        
        <div className="flex items-center justify-between px-4 pb-2">
           <div className="flex items-center gap-2 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] italic">
              <ShieldCheck size={14} className="text-indigo-500/50" /> Encrypted Node
           </div>
           <span className="text-[8px] font-black text-slate-700 uppercase tracking-widest">v4.0.2</span>
        </div>
      </div>
    </aside>
  );
}
