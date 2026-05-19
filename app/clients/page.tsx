import { Topbar } from "@/components/Topbar";
import { Eye, Edit2, Globe, DollarSign, CheckCircle2, UserPlus } from "lucide-react";
import { getClients } from "@/app/actions/clients";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function ClientsPage() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  const clients = await getClients();

  // Summing ALL packages for ALL clients to determine true portfolio value
  const totalRevenue = clients.reduce((sum, client) => {
    const clientTotal = client.packages.reduce(
      (pkgSum, pkg) => pkgSum + (pkg.price || 0),
      0
    );
    return sum + clientTotal;
  }, 0);

  // Determine total marketing channels managed across all clients
  const totalPlatformsCount = clients.reduce(
    (sum, client) => sum + client.platforms.length,
    0
  );

  return (
    <>
      <Topbar title="Clients" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/10">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">Client Portfolio</h1>
              <p className="text-sm text-gray-500 font-medium">Manage and track your active agency partnerships.</p>
            </div>
            {isAdmin && (
              <Link href="/clients/new" className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-6 rounded-xl tracking-widest text-[10px] uppercase transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
                <UserPlus size={16} /> Add New Client
              </Link>
            )}
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
                    {isAdmin && <th className="px-8 py-5 text-right">Actions</th>}
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
                                  {client.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-gray-900 text-sm leading-tight">{client.name}</p>
                                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{client.contact || "No Contact"}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex flex-wrap gap-1.5">
                                {client.platforms.length === 0 ? (
                                  <span className="text-[10px] text-gray-400 italic">None</span>
                                ) : (
                                  client.platforms.map((p: string) => (
                                    <span key={p} className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase tracking-widest rounded">
                                      {p}
                                    </span>
                                  ))
                                )}
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
                            {isAdmin && (
                              <td className="px-8 py-5 text-right">
                                <div className="flex items-center justify-end gap-2.5">
                                  <Link 
                                    href={`/clients/${client.id}/edit`} 
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 bg-white rounded-lg shadow-sm border border-gray-100 transition-all"
                                    title="View Details"
                                  >
                                    <Eye size={16} />
                                  </Link>
                                  <Link 
                                    href={`/clients/${client.id}/edit`} 
                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:border-indigo-100 bg-white rounded-lg shadow-sm border border-gray-100 transition-all"
                                    title="Edit Client"
                                  >
                                    <Edit2 size={16} />
                                  </Link>
                                </div>
                              </td>
                            )}
                         </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${isAdmin ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6 pb-12`}>
            {isAdmin && (
              <StatSmall label="Portfolio Value" value={totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })} icon={<DollarSign size={18}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            )}
            <StatSmall label="Channels Managed" value={totalPlatformsCount.toString()} icon={<Globe size={18}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
            <StatSmall label="Client Retention" value="98%" icon={<CheckCircle2 size={18}/>} color="text-amber-600" bgColor="bg-amber-50" />
          </div>

        </div>
      </div>
    </>
  );
}

interface StatSmallProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

function StatSmall({ label, value, icon, color, bgColor }: StatSmallProps) {
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
