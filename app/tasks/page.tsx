import { Topbar } from "@/components/Topbar";
import { getTasks, createTask, updateTaskStatus } from "@/app/actions/tasks";
import { getClients } from "@/app/actions/clients";
import { getProjects } from "@/app/actions/projects";
import { CheckCircle2, CircleDashed, Clock, MessageSquare, AlertCircle, Plus, Search, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function TasksPage({ searchParams }: { searchParams: { status?: string, q?: string } }) {
  const currentStatus = searchParams.status || "ALL";
  const tasks = await getTasks({ 
    status: currentStatus,
    search: searchParams.q
  });
  const clients = await getClients();
  const projects = await getProjects();

  return (
    <>
      <Topbar title="Task Infrastructure" breadcrumb="Operations" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-8">
          
          {/* List View Container */}
          <div className="flex-1 space-y-6">
            
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-1.5 p-1 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden whitespace-nowrap overflow-x-auto no-scrollbar">
                <StatusTab label="All" active={currentStatus === "ALL"} href="/tasks" />
                <StatusTab label="To Do" active={currentStatus === "TODO"} href="/tasks?status=TODO" />
                <StatusTab label="In Progress" active={currentStatus === "IN_PROGRESS"} href="/tasks?status=IN_PROGRESS" />
                <StatusTab label="Review" active={currentStatus === "REVIEW"} href="/tasks?status=REVIEW" />
                <StatusTab label="Done" active={currentStatus === "DONE"} href="/tasks?status=DONE" />
              </div>

              <div className="relative group w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={16} />
                <form action="/tasks" method="GET">
                  <input name="q" className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium shadow-sm" placeholder="Search tasks..." defaultValue={searchParams.q} />
                </form>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-extrabold">
                      <th className="px-6 py-4 w-12"></th>
                      <th className="px-6 py-4">Task Information</th>
                      <th className="px-6 py-4">Context</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4 text-right">Deadline</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-sm">
                    {tasks.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-24 text-center">
                          <div className="flex flex-col items-center gap-3">
                             <CircleDashed size={48} className="text-gray-200 stroke-[1]" />
                             <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No active tasks found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      tasks.map(task => (
                        <TaskRow key={task.id} task={task} />
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Creation Panel */}
          <div className="w-full lg:w-[320px] shrink-0">
             <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 lg:sticky lg:top-8 border-t-4 border-t-indigo-600">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                   <Plus size={18} className="text-indigo-600" /> New Operation
                </h3>
                <form action={createTask} className="space-y-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operation Title</label>
                      <input name="title" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" placeholder="E.g. Oct Content Review" />
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Client (Optional)</label>
                      <select name="clientId" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer">
                         <option value="">No Client</option>
                         {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Project</label>
                      <select name="projectId" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium cursor-pointer">
                         <option value="">No Project</option>
                         {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                   </div>

                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Date</label>
                      <input name="dueDate" type="date" required className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                   </div>

                   <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
                      Commit Task
                   </button>
                </form>
             </div>
          </div>

        </div>
      </div>
    </>
  );
}

function StatusTab({ label, active, href }: { label: string, active: boolean, href: string }) {
  return (
    <Link href={href} className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50'}`}>
       {label}
    </Link>
  )
}

function TaskRow({ task }: any) {
  const isDone = task.status === "DONE";
  const deadline = task.dueDate ? new Date(task.dueDate) : null;
  const isOverdue = deadline && deadline < new Date() && !isDone;

  return (
    <tr className={`hover:bg-gray-50/30 transition-all group ${isDone ? 'opacity-50' : ''}`}>
      <td className="px-6 py-4">
         <form action={async () => { "use server"; await updateTaskStatus(task.id, isDone ? "TODO" : "DONE") }}>
            <button type="submit" className={`transition-colors ${isDone ? 'text-indigo-600' : 'text-gray-200 hover:text-indigo-400'}`}>
               <CheckCircle2 size={24} />
            </button>
         </form>
      </td>
      <td className="px-6 py-4">
         <p className={`font-bold text-gray-900 ${isDone ? 'line-through' : ''}`}>{task.title}</p>
         <div className="flex items-center gap-3 mt-1">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-tighter flex items-center gap-1">
               <MessageSquare size={12} /> {task.comments?.length || 0} Comments
            </span>
         </div>
      </td>
      <td className="px-6 py-4">
         {task.client ? (
           <Link href={`/clients/${task.clientId}`} className="text-xs font-bold text-indigo-600 hover:underline">
              {task.client.name}
           </Link>
         ) : task.project ? (
           <Link href={`/projects/${task.projectId}`} className="text-xs font-bold text-amber-600 hover:underline">
              {task.project.name}
           </Link>
         ) : (
           <span className="text-xs font-bold text-gray-400 italic">Internal</span>
         )}
      </td>
      <td className="px-6 py-4">
         <Badge variant="outline" className={`font-black text-[9px] uppercase tracking-widest italic border-none ${isDone ? 'text-emerald-500 bg-emerald-50' : 'text-indigo-500 bg-indigo-50'}`}>
           {task.status.replace("_", " ")}
         </Badge>
      </td>
      <td className="px-6 py-4 text-right">
         <div className="flex items-center justify-end gap-2 text-xs font-bold">
            {isOverdue && <AlertCircle size={14} className="text-rose-500" />}
            <span className={isOverdue ? 'text-rose-600' : 'text-gray-500'}>
               {deadline ? deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric'}) : '--'}
            </span>
         </div>
      </td>
    </tr>
  )
}
