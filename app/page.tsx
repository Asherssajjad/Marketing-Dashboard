import { Topbar } from "@/components/Topbar";
import { Plus, Users, DollarSign, Clock, AlertTriangle, MessageSquare, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Shield, BarChart3, Binary, Activity } from "lucide-react";
import { getDashboardSummary } from "@/app/actions/dashboard";
import Link from "next/link";

export default async function DashboardPage() {
  const stats = await getDashboardSummary();

  return (
    <>
      <Topbar title="Intelligence Command" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB] relative isolate">
        
        {/* Dynamic Background Intelligence Layers */}
        <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full blur-[120px] -z-10 animate-pulse transition-all duration-[10000ms]"></div>
        <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/20 rounded-full blur-[100px] -z-10"></div>
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-white/40 rounded-full blur-[150px] -z-20"></div>

        <div className="max-w-[1440px] mx-auto space-y-12 pb-24">
          
          {/* Hero Command Profile */}
          <div className="group relative">
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-emerald-400 to-indigo-500 rounded-[40px] blur opacity-10 group-hover:opacity-25 transition duration-1000"></div>
             <div className="relative flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[40px] border border-white shadow-2xl shadow-indigo-100/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                     <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                     <span className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.4em] italic">System Status: Optimal</span>
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">
                     Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">Command</span>
                  </h1>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-[0.2em] max-w-md leading-relaxed opacity-70 italic">
                     Centralizing global operative intelligence and ecosystem throughput for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="hidden md:flex flex-col items-end pr-8 border-r border-gray-100">
                     <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 italic">Operative Count</p>
                     <p className="text-2xl font-black text-gray-900 italic tracking-tighter">14.8K <span className="text-emerald-500 text-xs">▲</span></p>
                  </div>
                  <Link href="/clients/new" className="px-10 py-5 bg-gray-900 hover:bg-black text-white rounded-2xl text-[11px] font-black flex items-center gap-4 transition-all shadow-2xl shadow-gray-200 uppercase tracking-[0.2em] italic group/btn">
                    <Plus size={20} className="group-hover/btn:rotate-90 transition-transform" /> Initialize Partner
                  </Link>
                </div>
             </div>
          </div>

          {/* High-Velocity Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatCard 
               label="Active Partners" 
               value={stats.clientCount.toString()} 
               trend="+12%" 
               positive={true}
               icon={<Users size={24} />} 
               accent="indigo"
            />
            <StatCard 
               label="M.R.R Velocity" 
               value={`$${(stats.totalRevenue / 1000).toFixed(1)}K`} 
               trend="+$4.2k" 
               positive={true}
               icon={<DollarSign size={24} />} 
               accent="emerald"
            />
            <StatCard 
               label="Live Pipelines" 
               value={stats.projectCount.toString()} 
               trend="-2 Units" 
               positive={false}
               icon={<Zap size={24} />} 
               accent="amber"
            />
            <StatCard 
               label="Critical Alerts" 
               value={stats.overdueTasks.toString()} 
               trend={stats.overdueTasks > 0 ? "URGENT" : "CLEAR"} 
               positive={stats.overdueTasks === 0}
               icon={<Shield size={24} />} 
               accent="rose"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Intelligence Activity Feed */}
            <div className="lg:col-span-8 space-y-10">
               <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-indigo-100/10 overflow-hidden">
                  <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/20">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100">
                           <Activity size={20} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Intelligence Stream</h3>
                           <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5 opacity-60">Real-time Operative Synchronicity</p>
                        </div>
                     </div>
                     <Link href="/tasks" className="px-6 py-2.5 bg-white border border-gray-100 rounded-xl text-[10px] font-black text-indigo-600 hover:bg-indigo-50 transition-all uppercase tracking-widest italic shadow-sm">Audit Full Log</Link>
                  </div>
                  <div className="p-4 space-y-2">
                     {stats.latestTasks.length === 0 ? (
                       <div className="py-24 flex flex-col items-center justify-center gap-6 opacity-30">
                          <Binary size={48} className="text-gray-300" />
                          <p className="font-black uppercase tracking-[0.3em] text-[10px] text-gray-400 italic">No activity detected // system idle</p>
                       </div>
                     ) : (
                       stats.latestTasks.map((t) => (
                         <ActivityRow 
                            key={t.id}
                            initial={t.client?.name.charAt(0) || "T"}
                            title={<>Operation <span className="text-indigo-600">{t.title}</span> synchronized for {t.client?.name || "Global Node"}</>}
                            time={new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            tag="Operational"
                            color="indigo"
                         />
                       ))
                     )}
                  </div>
               </div>
            </div>

            {/* Side Tactical Summary */}
            <div className="lg:col-span-4 space-y-10">
               <div className="bg-white rounded-[40px] border border-gray-100 shadow-xl shadow-indigo-100/10 p-10 relative overflow-hidden flex flex-col group">
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-600 via-indigo-400 to-indigo-600"></div>
                  
                  <div className="flex items-center justify-between mb-10">
                     <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Active Builds</h3>
                     <BarChart3 size={20} className="text-indigo-600" />
                  </div>

                  <div className="space-y-10 flex-1">
                     {stats.latestProjects.length === 0 ? (
                        <div className="py-16 text-center space-y-4 opacity-40">
                           <Zap size={32} className="mx-auto text-gray-200" />
                           <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">No active engineering pipelines</p>
                        </div>
                     ) : (
                        stats.latestProjects.map((p: any) => (
                          <div key={p.id} className="group/item cursor-pointer">
                             <div className="flex justify-between items-center mb-4">
                                <span className="text-[13px] font-black text-gray-900 group-hover/item:text-indigo-600 transition-colors uppercase italic truncate pr-4 tracking-tight">{p.name}</span>
                                <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full italic uppercase tracking-widest">{(p.status as string).toUpperCase()}</span>
                             </div>
                             <div className="w-full bg-gray-50 rounded-full h-2 overflow-hidden shadow-inner border border-gray-100">
                                <div className="bg-gradient-to-r from-indigo-600 to-indigo-400 h-full rounded-full shadow-[0_0_12px_rgba(79,70,229,0.3)] transition-all duration-1000 group-hover/item:shadow-[0_0_20px_rgba(79,70,229,0.5)]" style={{ width: p.status === 'LIVE' ? '100%' : '45%' }}></div>
                             </div>
                          </div>
                        ))
                     )}
                  </div>

                  <div className="mt-14 p-8 bg-gray-900 rounded-[30px] text-white shadow-2xl shadow-indigo-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full translate-x-12 -translate-y-12 blur-2xl"></div>
                    <div className="relative z-10 space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                             <Zap size={16} fill="currentColor" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 italic">Efficiency Protocol</span>
                       </div>
                       <p className="text-sm font-bold leading-relaxed italic uppercase tracking-tight text-indigo-50/90">
                          Optimize throughput by prioritizing <span className="text-white underline decoration-indigo-500 underline-offset-4">Critical Alerts</span> every AM cycle.
                       </p>
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

function StatCard({ label, value, trend, positive, icon, accent }: any) {
  const themes: any = {
    indigo: { text: "text-indigo-600", bg: "bg-indigo-50", line: "bg-indigo-500" },
    emerald: { text: "text-emerald-600", bg: "bg-emerald-50", line: "bg-emerald-500" },
    amber: { text: "text-amber-600", bg: "bg-amber-50", line: "bg-amber-500" },
    rose: { text: "text-rose-600", bg: "bg-rose-50", line: "bg-rose-500" }
  };

  const theme = themes[accent] || themes.indigo;

  return (
    <div className="bg-white border border-gray-100 rounded-[35px] p-9 shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-500 group relative overflow-hidden isolate">
      <div className={`absolute top-0 left-0 w-1.5 h-full ${theme.line} opacity-0 group-hover:opacity-100 transition-opacity`}></div>
      <div className="absolute top-0 right-0 w-36 h-36 bg-gray-50 rounded-full translate-x-18 -translate-y-18 group-hover:bg-indigo-50/30 transition-colors -z-10"></div>
      
      <div className="flex items-center justify-between mb-10">
        <div className={`w-15 h-15 rounded-2xl flex items-center justify-center shadow-2xl shadow-gray-200/50 ${theme.bg} ${theme.text} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
           <div className="p-3.5">
              {icon}
           </div>
        </div>
        <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-sm ring-1 ring-inset ${positive ? 'bg-emerald-50 text-emerald-600 ring-emerald-100' : 'bg-rose-50 text-rose-600 ring-rose-100'}`}>
           {positive ? <TrendingUp size={12} /> : <ArrowDownRight size={12} />}
           {trend}
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2 opacity-50 italic">{label}</h3>
        <p className="text-5xl font-black text-gray-900 leading-none tracking-tighter italic tabular-nums">{value}</p>
      </div>
    </div>
  );
}

function ActivityRow({ initial, title, time, tag, color }: any) {
  return (
    <div className="flex items-center justify-between group p-6 hover:bg-indigo-50/30 transition-all cursor-pointer rounded-[24px] border border-transparent hover:border-indigo-100/50">
      <div className="flex items-center gap-6">
        <div className={`w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-black text-xl shadow-sm italic transition-transform group-hover:scale-110 group-hover:rotate-12`}>
          {initial}
        </div>
        <div className="space-y-1.5">
          <div className="text-[15px] text-gray-800 font-bold group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic leading-none">{title}</div>
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em] flex items-center gap-2 opacity-60">
             <Clock size={12} strokeWidth={3} /> {time} <span className="text-gray-200">|</span> <Binary size={12} /> NODE_{Math.floor(Math.random() * 999)}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
         <span className={`text-[9px] font-black group-hover:text-white group-hover:bg-indigo-600 border border-indigo-100 px-4 py-1.5 rounded-full transition-all italic uppercase tracking-widest text-indigo-600`}>{tag}</span>
         <ArrowUpRight size={14} className="text-gray-200 group-hover:text-indigo-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
      </div>
    </div>
  );
}
