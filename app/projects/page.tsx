import { Topbar } from "@/components/Topbar";
import { MoreHorizontal, MessageSquare, Check, Trello, List, Trash2, Calendar } from "lucide-react";
import { getProjects, deleteProject } from "@/app/actions/projects";
import Link from "next/link";

export default async function ProjectsPage() {
  const projects = await getProjects();

  const columns = [
    { title: "PENDING", code: "PENDING" },
    { title: "IN PROGRESS", code: "IN_PROGRESS" },
    { title: "COMPLETED", code: "COMPLETED" },
  ];

  const getProjectsByStatus = (status: string) => {
    return projects.filter(p => p.status === status);
  };

  return (
    <>
      <Topbar title="Web Development Pipeline" breadcrumb="Projects" />
      
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between">
         <div className="flex items-center bg-gray-50 rounded-lg p-1">
            <button className="flex items-center gap-2 px-4 py-1.5 bg-white text-indigo-600 rounded shadow-sm text-xs font-black uppercase tracking-widest transition-all">
               <Trello size={14} /> Kanban
            </button>
         </div>
         
         <Link href="/projects/new" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
            Launch Project
         </Link>
      </div>

      <div className="flex-1 overflow-x-auto p-8 flex gap-8 pb-12 items-start bg-gray-50/20">
        {columns.map((col) => {
          const colProjects = getProjectsByStatus(col.code);
          return (
            <KanbanColumn key={col.code} title={col.title} count={colProjects.length}>
              {colProjects.map((p) => (
                <ProjectCard 
                  key={p.id}
                  id={p.id}
                  type={p.type || "PROJECT"}
                  date={p.dueDate ? new Date(p.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "--"}
                  title={p.name}
                  client={p.client?.name || "No Client"}
                  tasksCount={p._count.tasks}
                />
              ))}
            </KanbanColumn>
          );
        })}
      </div>
    </>
  );
}

function KanbanColumn({ title, count, children }: any) {
   return (
      <div className="flex-shrink-0 w-[350px] flex flex-col h-full bg-transparent">
         <div className="flex items-center justify-between mb-6 px-1">
            <div className="flex items-center gap-3">
               <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{title}</h3>
               <span className="px-2 py-0.5 rounded-full bg-white border border-gray-100 text-gray-500 text-[10px] font-black">{count}</span>
            </div>
         </div>
         <div className="flex flex-col gap-5">
            {children}
            
            <Link href="/projects/new" className="w-full py-4 rounded-2xl border border-dashed border-gray-300 text-gray-400 font-bold text-xs hover:border-indigo-400 hover:text-indigo-600 hover:bg-white transition-all flex items-center justify-center gap-2">
               + Add Project
            </Link>
         </div>
      </div>
   );
}

function ProjectCard({ id, type, date, title, client, tasksCount }: any) {
   const isDone = type === "COMPLETED";

   return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
         <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         
         <div className="flex items-center justify-between mb-4">
            <span className="px-2.5 py-1 rounded-md text-[9px] font-black tracking-widest uppercase bg-indigo-50 text-indigo-600">
               {type}
            </span>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400">
              <Calendar size={12} />
              {date}
            </div>
         </div>
         
         <h4 className="text-base font-bold text-gray-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{title}</h4>
         <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wide mb-6">Client: <span className="text-gray-600">{client}</span></p>

         <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                 <Check size={14} className="text-emerald-500" />
                 {tasksCount} Tasks
              </div>
            </div>

            <form action={async () => { "use server"; await deleteProject(id) }}>
              <button type="submit" className="text-gray-300 hover:text-rose-600 transition-colors p-1 opacity-0 group-hover:opacity-100">
                <Trash2 size={16} />
              </button>
            </form>
         </div>
      </div>
   );
}
