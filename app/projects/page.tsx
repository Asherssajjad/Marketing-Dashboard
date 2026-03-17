import { Topbar } from "@/components/Topbar";
import { MoreHorizontal, MessageSquare, Check, Trello, List, Search, Plus, Filter, Layout, Zap, Clock, ArrowUpRight } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getProjects();

  const columns = [
    { title: "DISCOVERY", code: "DISCOVERY", color: "border-t-gray-400" },
    { title: "DESIGN", code: "DESIGN", color: "border-t-indigo-400" },
    { title: "DEVELOPMENT", code: "DEVELOPMENT", color: "border-t-emerald-400" },
    { title: "REVIEW", code: "REVIEW", color: "border-t-amber-400" },
    { title: "TESTING", code: "TESTING", color: "border-t-rose-400" },
    { title: "LIVE", code: "LIVE", color: "border-t-indigo-600" },
  ];

  const getProjectsByStatus = (status: string) => {
    return projects.filter((p: any) => p.status === status);
  };

  return (
    <>
      <Topbar title="Pipeline Architecture" breadcrumb="AXION" />
      
      {/* Control Strip */}
      <div className="bg-white border-b border-gray-100 flex flex-col md:row items-center justify-between px-8 py-5 gap-6">
         <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
            <button className="flex items-center gap-3 px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100 text-[10px] font-black uppercase tracking-widest italic transition-all">
               <Trello size={18} /> Kanban Protocol
            </button>
            <button className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:text-gray-900 text-[10px] font-black uppercase tracking-widest italic transition-all">
               <List size={18} /> Master Ledger
            </button>
         </div>

         <div className="flex items-center gap-6">
            <div className="relative group hidden lg:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
               <input className="pl-11 pr-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64 transition-all shadow-inner" placeholder="Locate Build..." />
            </div>
            <Link href="/projects/new" className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest italic">
               <Plus size={18} /> Deploy Project
            </Link>
         </div>
      </div>

      <div className="flex-1 overflow-x-auto p-10 flex gap-10 pb-16 items-start bg-[#F9FAFB] no-scrollbar">
        {columns.map((col) => {
          const colProjects = getProjectsByStatus(col.code);
          return (
            <KanbanColumn key={col.code} title={col.title} count={colProjects.length} borderColor={col.color}>
              {colProjects.map((p: any) => (
                <Link href={`/projects/${p.id}`} key={p.id} className="block group">
                  <ProjectCard 
                    type={p.type || "WEB_APP"}
                    date={p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "--"}
                    title={p.name}
                    client={p.client?.name || "Global Partner"}
                    progress={p.status === "LIVE" ? 100 : 45} 
                  />
                </Link>
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </>
  );
}

function KanbanColumn({ title, count, children, borderColor }: any) {
   return (
      <div className={`flex-shrink-0 w-[400px] flex flex-col h-full bg-transparent border-t-4 ${borderColor} rounded-t-lg transition-all pt-4`}>
         <div className="flex items-center justify-between mb-8 px-2">
            <div className="flex items-center gap-4">
               <h3 className="text-[11px] font-black text-gray-900 tracking-[0.2em] uppercase italic">{title}</h3>
               <span className="w-6 h-6 rounded-lg bg-white border border-gray-100 text-indigo-600 flex items-center justify-center text-[10px] font-black shadow-sm">{count}</span>
            </div>
            <button className="text-gray-300 hover:text-gray-900 p-2">
               <MoreHorizontal size={20} />
            </button>
         </div>
         <div className="flex flex-col gap-6">
            {children}
            
            {/* Action Placeholder */}
            <button className="w-full py-5 rounded-[24px] border-2 border-dashed border-gray-100 text-gray-300 font-black text-[10px] uppercase tracking-widest italic hover:border-indigo-300 hover:text-indigo-600 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/30 transition-all group flex items-center justify-center gap-3">
               <Plus size={16} className="group-hover:rotate-90 transition-transform" /> Initialize Phase Item
            </button>
         </div>
      </div>
   );
}

function ProjectCard({ type, date, title, client, progress }: any) {
   return (
      <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-24 h-24 bg-gray-50 rounded-full translate-x-12 -translate-y-12 group-hover:bg-indigo-50 transition-all -z-10"></div>
         <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 text-[9px] font-black tracking-widest uppercase italic border border-indigo-100 shadow-sm">
               {type}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
               <Clock size={12} /> {date}
            </div>
         </div>
         
         <h4 className="text-xl font-black text-gray-900 tracking-tight leading-none mb-2 uppercase italic group-hover:text-indigo-600 transition-colors truncate">{title}</h4>
         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-8 border-l-2 border-gray-100 pl-3">Partner: {client}</p>

         <div className="space-y-3">
            <div className="flex justify-between items-end">
               <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest italic flex items-center gap-1.5"><Zap size={10} className="text-amber-500" /> Completion</span>
               <span className="text-sm font-black text-indigo-600 italic">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden shadow-inner">
               <div className="h-full bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(79,70,229,0.4)] transition-all duration-1000" style={{ width: `${progress}%` }}></div>
            </div>
         </div>

         <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-50">
            <div className="flex -space-x-3">
               <div className="w-8 h-8 rounded-full bg-indigo-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-indigo-700 italic">E</div>
               <div className="w-8 h-8 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-[10px] font-black text-emerald-700 italic">A</div>
            </div>
            <div className="w-8 h-8 rounded-xl bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-inner">
               <ArrowUpRight size={16} />
            </div>
         </div>
      </div>
   );
}
