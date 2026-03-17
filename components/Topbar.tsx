import { Bell, Search, Settings, Command, Globe, Zap, ShieldCheck } from "lucide-react";

export function Topbar({ title, breadcrumb }: { title: string, breadcrumb?: string }) {
  return (
    <header className="h-24 bg-white border-b border-gray-100 px-10 flex items-center justify-between shrink-0 z-30 w-full relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 via-emerald-400 to-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.3)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Left side: Navigation Context */}
      <div className="flex flex-col">
         <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] italic mb-1 mb-1">
            {breadcrumb ? (
               <>
                  <span className="hover:text-indigo-600 cursor-pointer transition-colors">{breadcrumb}</span>
                  <span className="text-gray-200">/</span>
                  <span className="text-indigo-600">{title}</span>
               </>
            ) : (
               <span className="text-indigo-600">AXION CORE</span>
            )}
         </div>
         <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tighter leading-none">{title}</h2>
      </div>

      {/* Center: Command Center Search */}
      <div className="flex-1 max-w-2xl mx-12 hidden lg:block group/search">
         <div className="relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/search:text-indigo-600 transition-colors pointer-events-none">
               <Command size={18} />
            </div>
            <input 
               type="text" 
               placeholder="CMD+K TO ACCESS GLOBAL ARCHIVE..." 
               className="w-full pl-14 pr-16 py-4 bg-gray-50/50 border border-gray-100 rounded-[20px] text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-400 focus:bg-white transition-all shadow-inner placeholder:text-gray-300 placeholder:italic"
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-30 group-focus-within/search:opacity-100 transition-opacity">
               <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[9px] font-black text-gray-400">⌘</span>
               <span className="px-1.5 py-0.5 border border-gray-300 rounded text-[9px] font-black text-gray-400">K</span>
            </div>
         </div>
      </div>

      {/* Right side: Operative Context */}
      <div className="flex items-center gap-8">
         <div className="flex items-center gap-3">
            <button className="relative w-12 h-12 flex items-center justify-center text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-indigo-100 shadow-sm relative group">
               <Bell size={20} className="group-hover:rotate-12 transition-transform" />
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(244,63,94,0.5)]"></span>
            </button>
            <button className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-indigo-600 bg-gray-50 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-indigo-100 shadow-sm group">
               <Globe size={20} className="group-hover:animate-spin-slow transition-transform" />
            </button>
         </div>
         
         <div className="flex items-center gap-5 border-l border-gray-50 pl-8 group/user cursor-pointer">
            <div className="flex flex-col text-right">
               <div className="flex items-center justify-end gap-2 mb-0.5">
                  <span className="text-[11px] font-black text-gray-900 italic uppercase tracking-tight leading-none group-hover/user:text-indigo-600 transition-colors">Managing Director</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
               </div>
               <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest italic opacity-60">Verified Admin // Alpha</span>
            </div>
            <div className="relative">
               <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white font-black italic text-xl shadow-xl shadow-indigo-100 ring-4 ring-indigo-50 group-hover/user:scale-110 group-hover/user:rotate-3 transition-all overflow-hidden border border-white/20">
                  A
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
               </div>
               <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-lg flex items-center justify-center shadow-lg border border-gray-50">
                  <ShieldCheck size={12} className="text-emerald-500" />
               </div>
            </div>
         </div>
      </div>
   </header>
  );
}
