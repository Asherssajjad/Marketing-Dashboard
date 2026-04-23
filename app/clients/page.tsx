import { Topbar } from "@/components/Topbar";
import { Eye, Edit2, TrendingUp, DollarSign, ClipboardList, UserPlus, CheckCircle2 } from "lucide-react";
import { getClients } from "@/app/actions/clients";
import { getProjects } from "@/app/actions/projects";
import Link from "next/link";
import prisma from "@/lib/prisma";

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects()
  ]);

  const totalRevenue = clients.reduce((sum, client) => {
     return sum + (client.packages[0]?.price || 0)
  }, 0);

  const activeProjectsCount = projects.filter(p => p.status === 'IN_PROGRESS').length;

  return (
    <>
      <Topbar title="Clients" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/10">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Client Portfolio</h1>
              <p className="text-sm text-gray-500 font-medium">Manage and track your active agency partnerships.</p>
            </div>
            <Link href="/clients/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl tracking-widest text-[10px] uppercase transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
              <UserPlus size={16} /> Add New Client
            </Link>
          </div>

          <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-black bg-gray-50/50">
                    <th className="px-8 py-5">Client Identity</th>
                    <th className="px-8 py-5">Platforms</th>
                    <th className="px-8 py-5">Active Plan</th>
                    <th className="px-8 py-5 text-center">Engagement</th>
                    <th className="px-8 py-5 text-center">Status</th>
                    <th className="px-8 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {clients.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-8 py-20 text-center text-gray-400 font-medium italic">
                        Your portfolio is empty. Start by onboarding your first client.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => {
                      const activePackage = client.packages[0];
                      const colors = ['bg-[#1C3B34]', 'bg-[#2E6B65]', 'bg-indigo-600', 'bg-rose-500', 'bg-amber-500'];
                      const colorIndex = client.name.length % colors.length;

                      return (
                         <tr key={client.id} className="hover:bg-gray-50/80 transition-colors group">
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm ${colors[colorIndex]}`}>
                                  {client.name.charAt(0)}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm leading-tight">{client.name}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{client.contact || "No Contact"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-wrap gap-1.5">
                                {client.platforms.map((p: string) => (
                                  <span key={p} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded">
                                    {p}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="font-bold text-gray-700 text-xs uppercase tracking-wide">{activePackage?.name || "Standard"}</span>
                            </td>
                            <td className="px-8 py-5 text-center">
                               <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                                  <CheckCircle2 size={12} /> High
                               </div>
                            </td>
                            <td className="px-8 py-5 text-center">
                              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${client.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                                {client.status}
                              </span>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all">
                                <button className="p-2 text-gray-400 hover:text-indigo-600 bg-white rounded-lg shadow-sm border border-gray-100"><Eye size={16} /></button>
                                <button className="p-2 text-gray-400 hover:text-indigo-600 bg-white rounded-lg shadow-sm border border-gray-100"><Edit2 size={16} /></button>
                              </div>
                            </td>
                         </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12">
            <StatSmall label="Portfolio Value" value={`$${totalRevenue.toLocaleString()}`} icon={<DollarSign size={18}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <StatSmall label="Active Pipelines" value={activeProjectsCount.toString()} icon={<TrendingUp size={18}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
            <StatSmall label="Client Retention" value="98%" icon={<CheckCircle2 size={18}/>} color="text-amber-600" bgColor="bg-amber-50" />
          </div>

        </div>
      </div>
    </>
  );
}

function StatSmall({ label, value, icon, color, bgColor }: any) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-xl font-bold text-gray-900 leading-tight mt-0.5">{value}</p>
      </div>
    </div>
  );
}
