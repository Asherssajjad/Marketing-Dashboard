import { getProjectDetail, updateProjectMilestones, updateProjectStatus } from "@/app/actions/projects";
import { Topbar } from "@/components/Topbar";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  FileText, 
  Layout, 
  MessageSquare, 
  Plus, 
  Settings,
  MoreVertical,
  ChevronRight,
  TrendingUp,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectDetail(params.id);

  if (!project) {
    return notFound();
  }

  // Handle milestones - default if empty
  const milestones: any[] = (project.milestones as any[]) || [
    { id: 1, title: "Discovery & Briefing", completed: false, dueDate: "TBD" },
    { id: 2, title: "UI/UX Design Phase", completed: false, dueDate: "TBD" },
    { id: 3, title: "Frontend Development", completed: false, dueDate: "TBD" },
    { id: 4, title: "Backend Integration", completed: false, dueDate: "TBD" },
    { id: 5, title: "QA & Client Review", completed: false, dueDate: "TBD" },
    { id: 6, title: "Final Launch", completed: false, dueDate: "TBD" },
  ];

  const completedCount = milestones.filter(m => m.completed).length;
  const progressPercent = milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0;

  return (
    <>
      <Topbar title={project.name} breadcrumb={`Projects / ${project.client?.name}`} />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto space-y-6">
          
          {/* Project Overview Header */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -translate-y-32 translate-x-32 blur-3xl -z-10"></div>
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-100 ring-4 ring-indigo-50">
                  <Layout size={32} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{project.name}</h1>
                    <Badge className="bg-amber-100 text-amber-700 border-none font-black tracking-widest text-[10px] uppercase italic px-3">
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 font-bold flex items-center gap-2">
                    PARTNER: <Link href={`/clients/${project.clientId}`} className="text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest text-xs">{project.client?.name}</Link>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">ESTIMATED LAUNCH</p>
                  <p className="text-lg font-black text-gray-900 leading-none">
                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Q4 2024'}
                  </p>
                </div>
                <form action={async () => { "use server"; await updateProjectStatus(params.id, "LIVE") }}>
                   <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl text-sm transition-all shadow-lg shadow-indigo-200 flex items-center gap-2 uppercase tracking-widest">
                     <TrendingUp size={18} /> GO LIVE
                   </button>
                </form>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="mt-10 space-y-3">
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></div>
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Execution Progress</p>
                </div>
                <p className="text-2xl font-black text-indigo-600 italic">{progressPercent}%</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div className="bg-indigo-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-sm" style={{ width: `${progressPercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left/Main Column: Milestones & Tasks */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Milestones Card */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-2">
                     <CheckCircle2 size={24} className="text-indigo-600" /> Milestone Tracker
                   </h3>
                   <span className="text-xs font-bold text-gray-400">{completedCount} of {milestones.length} Done</span>
                </div>
                <div className="divide-y divide-gray-50">
                   {milestones.map((m: any, index: number) => (
                     <div key={m.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                        <div className="flex items-start gap-5">
                           <form action={async () => { 
                             "use server"; 
                             const newMilestones = [...milestones];
                             newMilestones[index].completed = !newMilestones[index].completed;
                             await updateProjectMilestones(params.id, newMilestones);
                           }}>
                              <button type="submit" className={`mt-0.5 transition-all transform hover:scale-110 ${m.completed ? 'text-indigo-600' : 'text-gray-200 hover:text-indigo-400'}`}>
                                 {m.completed ? <CheckCircle2 size={26} /> : <Circle size={26} />}
                              </button>
                           </form>
                           <div>
                              <p className={`font-black text-base tracking-tight ${m.completed ? 'text-gray-300 line-through' : 'text-gray-900'}`}>{m.title}</p>
                              <div className="flex items-center gap-4 mt-2">
                                 <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-0.5 rounded">
                                    <Clock size={12} /> {m.dueDate}
                                 </div>
                                 <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-tight">Active Phase</span>
                                 </div>
                              </div>
                           </div>
                        </div>
                        <button className="p-2 text-gray-200 group-hover:text-gray-400 hover:bg-gray-100 rounded-lg transition-all">
                           <MoreVertical size={18} />
                        </button>
                     </div>
                   ))}
                </div>
                <div className="p-4 bg-gray-50/50 border-t border-gray-50">
                   <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-400 font-bold text-xs uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all">
                      + Initialize New Phase
                   </button>
                </div>
              </div>

              {/* Linked Tasks Section */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                   <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic flex items-center gap-2">
                      <Clock size={24} className="text-amber-500" /> Operational Tasks
                   </h3>
                   <Link href="/tasks" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">Manage <ExternalLink size={12} /></Link>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.tasks.length === 0 ? (
                    <div className="col-span-full py-10 text-center flex flex-col items-center gap-3">
                       <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-200">
                          <Plus size={24} />
                       </div>
                       <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Link operational items</p>
                    </div>
                  ) : (
                    project.tasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-indigo-100 hover:shadow-md transition-all cursor-pointer group">
                        <div>
                           <p className="font-black text-gray-900 text-sm group-hover:text-indigo-600 transition-colors">{task.title}</p>
                           <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Status: {task.status}</p>
                        </div>
                        <ChevronRight size={16} className="text-gray-300" />
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Side Column: Meta Info & Files */}
            <div className="space-y-8">
              
              {/* Client Snapshot Card */}
              <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-100 flex flex-col gap-6">
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">PARTNER SNAPSHOT</p>
                    <h3 className="text-2xl font-black">{project.client?.name}</h3>
                 </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold border-b border-indigo-500/50 pb-2">
                       <span className="opacity-60">Status</span>
                       <span className="text-emerald-300">Active</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold border-b border-indigo-500/50 pb-2">
                       <span className="opacity-60">Revenue Impact</span>
                       <span className="text-indigo-100">$2,400/mo</span>
                    </div>
                 </div>
                 <Link href={`/clients/${project.clientId}`} className="w-full py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-center text-xs font-black uppercase tracking-widest border border-white/20">
                    Client Intelligence
                 </Link>
              </div>

              {/* Assets & Files */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic">Digital Assets</h3>
                  <button className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-100 transition-all"><Plus size={20} /></button>
                </div>
                <div className="space-y-4">
                  <FileRow name="Global_Assets_V4.zip" size="124 MB" date="Oct 12" />
                  <FileRow name="Prototype_Final.xd" size="45 MB" date="Oct 20" />
                  <FileRow name="Technical_Brief.pdf" size="2.4 MB" date="Oct 24" />
                </div>
              </div>

              {/* Audit Trail */}
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
                <h3 className="text-lg font-black text-gray-900 mb-8 uppercase tracking-widest italic">Operations Log</h3>
                <div className="space-y-8 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
                  <ActivityLogItem 
                    title={`Milestone updated for ${project.name}`} 
                    time="JUST NOW" 
                    user="SYSTEM" 
                    color="bg-indigo-600" 
                  />
                  <ActivityLogItem 
                    title="Phase 1 Verification" 
                    time="2 DAYS AGO" 
                    user="Sarah" 
                    color="bg-emerald-500" 
                  />
                  <ActivityLogItem 
                    title="Workday Initialized" 
                    time="OCT 08" 
                    user="Admin" 
                    color="bg-gray-800" 
                  />
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function FileRow({ name, size, date }: any) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-50 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group shadow-sm hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all shadow-inner">
          <FileText size={22} />
        </div>
        <div>
          <p className="text-sm font-black text-gray-900 truncate max-w-[140px] uppercase tracking-tighter">{name}</p>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{size} • {date}</p>
        </div>
      </div>
      <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
    </div>
  )
}

function ActivityLogItem({ title, time, user, color }: any) {
  return (
    <div className="relative pl-8">
      <div className={`absolute left-0 top-1 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center ${color} ring-4 ring-gray-50`}></div>
      <div>
        <p className="text-xs font-black text-gray-900 leading-tight uppercase tracking-tight">{title}</p>
        <p className="text-[10px] text-gray-400 font-black mt-2 uppercase tracking-widest border-l-2 border-indigo-100 pl-2">{user} // {time}</p>
      </div>
    </div>
  )
}
