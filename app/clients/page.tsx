import { Topbar } from "@/components/Topbar";
import { Eye, Edit2, TrendingUp, DollarSign, ClipboardList, Plus, MoreHorizontal, Search, Filter, ArrowUpRight, Globe, Zap, Users } from "lucide-react";
import { getClients } from "@/app/actions/clients";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default async function ClientsPage() {
  const clients = await getClients();

  const totalRevenue = clients.reduce((acc, c) => acc + (c.packages[0]?.price || 0), 0);
  const activeSlas = clients.filter(c => c.packages.length > 0).length;

  return (
    <>
      <Topbar title="Partner Intelligence" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Action Row */}
          <div className="flex flex-col lg:row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
             <div className="relative z-10">
               <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Client Ecosystem</h1>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-60">Managing {clients.length} Active Global Partnerships</p>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="relative group hidden md:block">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                   <input className="pl-11 pr-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 transition-all shadow-inner" placeholder="Search partners..." />
                </div>
                <Link href="/clients/new" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black flex items-center gap-3 transition-all shadow-xl shadow-indigo-100 uppercase tracking-widest italic">
                   <Plus size={18} /> Initialize Partner
                </Link>
             </div>
          </div>

          {/* KPI Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnalyticsCard icon={<Users size={24} />} label="Total Partners" value={clients.length} trend="+2 New" positive color="text-indigo-600" bgColor="bg-indigo-50" />
            <AnalyticsCard icon={<DollarSign size={24} />} label="Portfolio Revenue" value={`$${totalRevenue.toLocaleString()}`} trend="+$4.2k" positive color="text-emerald-600" bgColor="bg-emerald-50" />
            <AnalyticsCard icon={<Zap size={24} />} label="Active SLAs" value={activeSlas} trend="98% Uptime" positive color="text-amber-600" bgColor="bg-amber-50" />
          </div>

          {/* Client Table Section */}
          <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-indigo-600">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
               <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest">Partner Directory</h3>
               <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                  <Filter size={20} />
               </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white border-b border-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-300 font-black">
                    <th className="px-8 py-6">Partner Identity</th>
                    <th className="px-8 py-6">Ecosystems</th>
                    <th className="px-8 py-6">SLA Level</th>
                    <th className="px-8 py-6">Operational Load</th>
                    <th className="px-8 py-6 text-center">Status</th>
                    <th className="px-8 py-6 text-right">Ops</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-bold text-sm bg-white">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-24 text-center">
                         <div className="flex flex-col items-center gap-4 text-gray-200">
                            <Globe size={64} className="stroke-1" />
                            <p className="font-black uppercase tracking-widest text-xs">No active partnerships detected</p>
                         </div>
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="hover:bg-gray-50/50 transition-all group">
                         <td className="px-8 py-6">
                            <Link href={`/clients/${client.id}`} className="flex items-center gap-5">
                               <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg italic shadow-inner transition-transform group-hover:scale-110">
                                  {client.name.charAt(0)}
                               </div>
                               <div>
                                  <p className="text-gray-900 font-black uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors text-base">{client.name}</p>
                                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">{client.contact || "Unverified Contact"}</p>
                               </div>
                            </Link>
                         </td>
                         <td className="px-8 py-6">
                            <div className="flex gap-2">
                               {client.platforms.map((p: string) => (
                                 <span key={p} className="text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm">
                                   {p}
                                 </span>
                               ))}
                            </div>
                         </td>
                         <td className="px-8 py-6">
                            <p className="text-gray-900 font-black text-xs uppercase italic tracking-tight">{client.packages[0]?.name || "Standard Engine"}</p>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-0.5">${client.packages[0]?.price?.toLocaleString() || 0} / MO</p>
                         </td>
                         <td className="px-8 py-6">
                            <div className="space-y-2">
                               <div className="flex justify-between items-end">
                                  <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Throughput</span>
                                  <span className="text-[10px] font-black text-indigo-600 italic">45%</span>
                               </div>
                               <div className="w-32 bg-gray-50 h-1.5 rounded-full overflow-hidden shadow-inner">
                                  <div className="bg-indigo-600 h-full rounded-full shadow-[0_0_8px_rgba(79,70,229,0.3)]" style={{ width: '45%' }}></div>
                               </div>
                            </div>
                         </td>
                         <td className="px-8 py-6 text-center">
                            <Badge className="bg-emerald-500 text-white border-none font-black tracking-widest text-[9px] px-3 py-1 uppercase italic shadow-sm ring-4 ring-emerald-50/50">Active</Badge>
                         </td>
                         <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-3">
                                <Link href={`/clients/${client.id}`} className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all shadow-sm border border-transparent">
                                   <Eye size={18} />
                                </Link>
                                <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-gray-100 rounded-xl transition-all shadow-sm">
                                   <MoreHorizontal size={18} />
                                </button>
                             </div>
                         </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function AnalyticsCard({ icon, label, value, trend, positive, color, bgColor }: any) {
   return (
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-50/30 transition-colors -z-10"></div>
         <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 transition-transform group-hover:scale-110 ${bgColor} ${color}`}>
              {icon}
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-sm ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               <TrendingUp size={12} /> {trend}
            </div>
         </div>
         <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">{label}</p>
            <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter italic">{value}</p>
         </div>
      </div>
   )
}
