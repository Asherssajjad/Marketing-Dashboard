import { getClientDetail } from "@/app/actions/clients";
import { Topbar } from "@/components/Topbar";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, 
  Layout, 
  Layers, 
  CheckSquare, 
  CreditCard, 
  FileText, 
  MoreVertical,
  Plus,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Download
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({ params, searchParams }: { params: { id: string }, searchParams: { tab?: string } }) {
  const client = await getClientDetail(params.id);
  const activeTab = searchParams.tab || "overview";

  if (!client) {
    return notFound();
  }

  const activePackage = client.packages[0];

  return (
    <>
      <Topbar title={client.name} breadcrumb={`Clients / ${client.name}`} />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1280px] mx-auto space-y-6">
          
          {/* Client Header Info */}
          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/40 rounded-full translate-x-32 -translate-y-32 blur-3xl -z-10"></div>
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-3xl bg-indigo-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-indigo-100 ring-8 ring-indigo-50">
                {client.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-4 mb-2">
                   <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">{client.name}</h1>
                   <Badge className="bg-emerald-50 text-emerald-600 border-none font-black tracking-widest text-[10px] uppercase px-3 italic shadow-sm">ACTIVE PARTNER</Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 font-bold flex items-center gap-2"><TrendingUp size={14} className="text-indigo-500" /> {client.contact}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200"></div>
                  <div className="flex gap-2">
                    {client.platforms.map(p => (
                      <span key={p} className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-tighter border border-indigo-100 shadow-sm">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-black rounded-xl text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm">Report Issue</button>
              <button className="px-6 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">Configure Package</button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar gap-2">
            <TabLink label="OVERVIEW" icon={<Layout size={18} />} active={activeTab === "overview"} id={params.id} tab="overview" />
            <TabLink label="CONTENT" icon={<Layers size={18} />} active={activeTab === "content"} id={params.id} tab="content" />
            <TabLink label="PROJECTS" icon={<LineChart size={18} />} active={activeTab === "projects"} id={params.id} tab="projects" />
            <TabLink label="TASKS" icon={<CheckSquare size={18} />} active={activeTab === "tasks"} id={params.id} tab="tasks" />
            <TabLink label="FINANCIALS" icon={<CreditCard size={18} />} active={activeTab === "payments"} id={params.id} tab="payments" />
          </div>

          {/* Tab Content Switching */}
          <div className="mt-8 transition-all duration-300">
             {activeTab === "overview" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                   <div className="lg:col-span-2 space-y-8">
                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 border-t-4 border-t-indigo-600">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-widest italic">Subscription Strategy</h3>
                            <p className="text-sm font-bold text-gray-400 mt-1 uppercase">Monthly Service Level Agreement</p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">M.R.R IMPACT</p>
                             <p className="text-2xl font-black text-indigo-600 italic tracking-tighter">${activePackage?.price?.toLocaleString() || 0}.00</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                           <MetricItem label="Reels Quota" value={`${activePackage?.reels_pm || 0} / mo`} />
                           <MetricItem label="Post Quota" value={`${activePackage?.posts_pm || 0} / mo`} />
                           <MetricItem label="Ad Tech" value={activePackage?.has_ads ? 'Enabled' : 'Disabled'} />
                        </div>
                      </div>

                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden border-t-4 border-t-amber-500">
                        <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic">High Priority Ops</h3>
                          <Link href={`/clients/${params.id}?tab=tasks`} className="text-[10px] font-black text-indigo-600 hover:underline uppercase tracking-widest">EXPAND LIST</Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                          {client.tasks.length === 0 ? (
                            <p className="p-16 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No active operations</p>
                          ) : (
                            client.tasks.slice(0, 5).map(task => (
                              <div key={task.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer group">
                                <div className="flex items-center gap-6">
                                  <div className="w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow-sm shadow-amber-200"></div>
                                  <div>
                                    <p className="font-black text-gray-900 text-sm tracking-tight group-hover:text-indigo-600 transition-colors uppercase">{task.title}</p>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 italic">{task.status.replace("_", " ")}</p>
                                  </div>
                                </div>
                                <ArrowUpRight size={18} className="text-gray-200 group-hover:text-indigo-600 transition-all" />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                   </div>

                   <div className="space-y-8">
                      <div className="bg-gray-900 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden group">
                         <div className="absolute inset-0 bg-indigo-600/20 group-hover:bg-indigo-600/30 transition-all"></div>
                         <h3 className="text-lg font-black mb-6 uppercase tracking-widest italic relative z-10">Web Pipeline</h3>
                         <div className="space-y-6 relative z-10">
                            {client.projects.length === 0 ? (
                              <p className="text-sm font-bold opacity-40 py-8 text-center italic">No active development</p>
                            ) : (
                              client.projects.map(p => (
                                <div key={p.id} className="space-y-3">
                                  <div className="flex justify-between items-end">
                                    <span className="font-black text-sm uppercase tracking-tighter">{p.name}</span>
                                    <span className="text-[10px] font-black text-indigo-400">{p.status}</span>
                                  </div>
                                  <div className="w-full bg-white/10 rounded-full h-2">
                                    <div className="bg-indigo-500 h-2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: '45%' }}></div>
                                  </div>
                                </div>
                              ))
                            )}
                         </div>
                      </div>

                      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 border-t-4 border-t-emerald-500">
                        <div className="flex items-center gap-3 mb-6">
                           <CreditCard size={20} className="text-emerald-500" />
                           <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest italic">Billing Status</h3>
                        </div>
                        <div className="space-y-6">
                           <div className="flex items-center justify-between p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
                             <div>
                               <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">LAST PAYMENT</p>
                               <p className="text-lg font-black text-gray-900 italic">OCT 12, 2024</p>
                             </div>
                             <Badge className="bg-emerald-500 text-white border-none font-black italic px-3 py-1 shadow-sm ring-4 ring-emerald-50">PAID</Badge>
                           </div>
                           <button className="w-full py-4 bg-gray-50 text-gray-500 font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                              <Download size={14} /> Download Ledger
                           </button>
                        </div>
                      </div>
                   </div>
                </div>
             )}

             {activeTab === "content" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center py-24">
                   <Layers size={48} className="mx-auto text-gray-100 mb-4" />
                   <h3 className="text-xl font-bold text-gray-900 italic">Content Intel Coming Soon</h3>
                   <p className="text-sm text-gray-400 font-medium">We are initializing the specific content feed for {client.name}.</p>
                   <Link href={`/content/${params.id}`} className="mt-6 inline-block px-8 py-3 bg-indigo-600 text-white font-black rounded-xl text-xs uppercase tracking-widest italic">Open Tracker</Link>
                </div>
             )}

             {activeTab === "projects" && (
                <div className="space-y-6">
                   <div className="flex justify-between items-center px-4">
                      <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-widest">Active Development</h3>
                      <button className="px-4 py-2 bg-indigo-600 text-white font-black rounded-lg text-xs uppercase tracking-widest">+ New Project</button>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {client.projects.map(p => (
                        <Link href={`/projects/${p.id}`} key={p.id} className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                           <div className="flex justify-between items-start mb-6">
                              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black italic uppercase">{p.type?.charAt(0) || 'W'}</div>
                              <Badge className="bg-indigo-50 text-indigo-600 border-none font-bold uppercase text-[9px]">{p.status}</Badge>
                           </div>
                           <h4 className="text-lg font-black text-gray-900 tracking-tight leading-none mb-2 italic">{p.name}</h4>
                           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Type: {p.type}</p>
                           <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                           </div>
                        </Link>
                      ))}
                   </div>
                </div>
             )}

             {activeTab === "tasks" && (
               <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                     <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest">Comprehensive Backlog</h3>
                     <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">+ Initialize New Operation</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                     {client.tasks.map(task => (
                        <div key={task.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors cursor-pointer group">
                           <div className="flex items-center gap-6">
                              <CheckSquare size={20} className={task.status === 'DONE' ? 'text-emerald-500' : 'text-gray-200'} />
                              <div>
                                 <p className="font-black text-gray-900 text-base italic uppercase group-hover:text-indigo-600 transition-colors tracking-tight">{task.title}</p>
                                 <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Status: {task.status.replace("_", " ")}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">DUE DATE</p>
                              <p className="text-sm font-black text-gray-900">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'TBD'}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
             )}

             {activeTab === "payments" && (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                   <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                      <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest italic">Financial Ledger</h3>
                      <button className="text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">Download Master Report</button>
                   </div>
                   <div className="divide-y divide-gray-50">
                      {client.payments.length === 0 ? (
                        <p className="p-16 text-center text-gray-400 font-black uppercase tracking-widest">No transaction history detected</p>
                      ) : (
                        client.payments.map(pay => (
                          <div key={pay.id} className="p-8 flex items-center justify-between hover:bg-gray-50/30 transition-colors group">
                             <div className="flex items-center gap-8">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-black italic ring-4 ring-emerald-50 shadow-inner">
                                   $
                                </div>
                                <div>
                                   <p className="text-base font-black text-gray-900 italic uppercase">Payment Cycle: {new Date(0, pay.month - 1).toLocaleString('default', { month: 'long' })} {pay.year}</p>
                                   <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Amount Released: ${pay.amount.toLocaleString()}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-8">
                                <Badge className={`font-black italic text-[10px] uppercase tracking-widest px-3 py-1 ring-4 ${pay.status === 'PAID' ? 'bg-emerald-500 text-white ring-emerald-50' : 'bg-amber-500 text-white ring-amber-50'}`}>
                                   {pay.status}
                                </Badge>
                                <button className="p-3 bg-gray-50 rounded-xl text-gray-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-all">
                                   <Download size={20} />
                                </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             )}
          </div>
        </div>
      </div>
    </>
  );
}

function TabLink({ label, icon, active = false, id, tab }: any) {
  return (
    <Link href={`/clients/${id}?tab=${tab}`} className={`flex items-center gap-3 px-8 py-5 transition-all border-b-4 font-black text-[10px] tracking-widest uppercase italic whitespace-nowrap ${active ? 'border-indigo-600 text-indigo-600 bg-indigo-50/30' : 'border-transparent text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'}`}>
      {icon}
      {label}
    </Link>
  )
}

function MetricItem({ label, value }: { label: string, value: string }) {
   return (
      <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
         <div className="absolute right-0 top-0 w-16 h-16 bg-white/50 rounded-full translate-x-8 -translate-y-8 blur-xl"></div>
         <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 relative z-10">{label}</p>
         <p className="text-lg font-black text-gray-900 italic relative z-10">{value}</p>
      </div>
   )
}
