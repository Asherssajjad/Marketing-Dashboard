import { Topbar } from "@/components/Topbar";
import { Plus, Users, DollarSign, Clock, AlertTriangle, MessageSquare, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardSummary();

  return (
    <>
      <Topbar title="Intelligence Command" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Hero Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
             <div className="relative z-10">
               <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Operational Overview</h1>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-60">System Status: Optimal // {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
             </div>
             <div className="flex items-center gap-4 relative z-10">
               <button className="px-6 py-3 border border-gray-200 rounded-xl text-xs font-black text-gray-400 uppercase tracking-widest hover:bg-gray-50 hover:text-gray-900 transition-all italic">Generate Audit</button>
               <Link href="/clients/new" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest italic">
                 <Plus size={18} /> New Partner
               </Link>
             </div>
          </div>

          {/* Core Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
               label="ACTIVE PARTNERS" 
               value={stats.clientCount.toString()} 
               trend="+12%" 
               positive={true}
               icon={<Users size={24} />} 
               color="text-indigo-600" 
               bgColor="bg-indigo-50"
            />
            <StatCard 
               label="M.R.R (ESTIMATED)" 
               value={`$${stats.totalRevenue.toLocaleString()}`} 
               trend="+5.4k" 
               positive={true}
               icon={<DollarSign size={24} />} 
               color="text-emerald-600" 
               bgColor="bg-emerald-50"
            />
            <StatCard 
               label="LIVE PIPELINE" 
               value={stats.projectCount.toString()} 
               trend="-2" 
               positive={false}
               icon={<Zap size={24} />} 
               color="text-amber-600" 
               bgColor="bg-amber-50"
            />
            <StatCard 
               label="CRITICAL OPS" 
               value={stats.overdueTasks.toString()} 
               trend={stats.overdueTasks > 0 ? "URGENT" : "CLEAR"} 
               positive={stats.overdueTasks === 0}
               icon={<AlertTriangle size={24} />} 
               color="text-rose-600" 
               bgColor="bg-rose-50"
               isWarning={stats.overdueTasks > 0}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            
            {/* Activity Stream */}
            <div className="lg:col-span-2 bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
               <div className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                  <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest">Global Activity Stream</h3>
                  <Link href="/tasks" className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">Audit Full Log</Link>
               </div>
               <div className="p-2 divide-y divide-gray-50">
                  {stats.latestTasks.length === 0 ? (
                    <div className="py-24 text-center text-gray-300 font-black uppercase tracking-widest text-xs">Internal silence detected.</div>
                  ) : (
                    stats.latestTasks.map((t) => (
                      <ActivityRow 
                         key={t.id}
                         initial={t.client?.name.charAt(0) || "T"}
                         title={<span>Operation <strong>{t.title}</strong> initialized for {t.client?.name || "Global"}</span>}
                         time={new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                         tag="Operational"
                         color="bg-indigo-50 text-indigo-600"
                      />
                    ))
                  )}
               </div>
            </div>

            {/* Side Intelligence */}
            <div className="space-y-10">
               <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-8 border-t-8 border-t-indigo-600">
                  <h3 className="text-lg font-black text-gray-900 mb-8 uppercase italic tracking-widest">Active Development</h3>
                  <div className="space-y-8">
                     {stats.latestProjects.length === 0 ? (
                        <p className="text-xs font-black text-gray-300 py-10 text-center uppercase tracking-widest">No active engineering</p>
                     ) : (
                        stats.latestProjects.map(p => (
                          <div key={p.id} className="group cursor-pointer">
                             <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-black text-gray-900 group-hover:text-indigo-600 transition-colors uppercase italic truncate pr-4">{p.name}</span>
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded italic">{(p.status as string).toUpperCase()}</span>
                             </div>
                             <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden shadow-inner">
                                <div className="bg-indigo-600 h-2 rounded-full shadow-[0_0_10px_rgba(79,70,229,0.2)] transition-all duration-1000" style={{ width: p.status === 'LIVE' ? '100%' : '45%' }}></div>
                             </div>
                          </div>
                        ))
                     )}
                  </div>
                  <div className="mt-12 p-6 bg-indigo-600 rounded-[24px] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/5 group-hover:bg-white/10 transition-colors"></div>
                    <div className="relative z-10">
                       <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60 flex items-center gap-2 italic">
                          <Zap size={14} className="animate-pulse" /> Efficiency Tip
                       </p>
                       <p className="text-sm font-bold leading-relaxed italic uppercase tracking-tight">Review critical operations every Monday @ 09:00 for optimal throughput.</p>
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

function StatCard({ label, value, trend, positive, icon, color, bgColor, isWarning }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-50/50 transition-colors -z-10"></div>
      <div className="flex items-center justify-between mb-8">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 ${bgColor} ${color} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-sm ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
           {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
           {trend}
        </div>
      </div>
      <div>
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">{label}</h3>
        <p className="text-4xl font-black text-gray-900 leading-none tracking-tighter italic">{value}</p>
      </div>
    </div>
  );
}

function ActivityRow({ initial, title, time, tag, color }: any) {
  return (
    <div className="flex items-start justify-between group p-6 hover:bg-gray-50/80 transition-all cursor-pointer rounded-2xl mx-2">
      <div className="flex gap-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black italic shadow-inner shrink-0 ${color}`}>
          {initial}
        </div>
        <div>
          <div className="text-sm text-gray-800 font-bold group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic leading-snug">{title}</div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2 flex items-center gap-1.5">
             <Clock size={12} /> {time}
          </p>
        </div>
      </div>
      <span className="text-[9px] font-black text-gray-300 group-hover:text-indigo-600 tracking-widest uppercase border border-gray-100 px-3 py-1 rounded-lg transition-colors italic">{tag}</span>
    </div>
  );
}
