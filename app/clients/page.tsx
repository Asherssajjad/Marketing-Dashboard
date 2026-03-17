import { Topbar } from "@/components/Topbar";
import { Eye, Edit2, TrendingUp, DollarSign, ClipboardList } from "lucide-react";

export default function ClientsPage() {
  return (
    <>
      <Topbar title="Clients" breadcrumb="Home" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex gap-4 items-center flex-1">
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none">
                <option>Platform</option>
              </select>
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none">
                <option>Payment Status</option>
              </select>
              <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 outline-none">
                <option>Team Member</option>
              </select>
              <button className="text-sm text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Clear All</button>
            </div>
            <div className="text-sm font-medium text-gray-500">
              Showing <strong className="text-gray-900">24</strong> clients
            </div>
          </div>

          {/* Client Table */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                    <th className="px-6 py-4">Client Name</th>
                    <th className="px-6 py-4">Platforms</th>
                    <th className="px-6 py-4">Active Package</th>
                    <th className="px-6 py-4">Content Progress</th>
                    <th className="px-6 py-4 text-center">Payment Status</th>
                    <th className="px-6 py-4 text-center">Team</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <ClientRow 
                    name="Velvet & Co." 
                    url="velvet-co.com"
                    platforms={['INSTAGRAM', 'TIKTOK']}
                    package="Premium Content"
                    progress="Milestone 3/4"
                    percent={65}
                    status="Paid"
                    color="bg-emerald-500"
                    logoColor="bg-[#1C3B34]"
                  />
                  <ClientRow 
                    name="Lumina Digital" 
                    url="lumina.io"
                    platforms={['LINKEDIN', 'TWITTER']}
                    package="Standard Strategy"
                    progress="Milestone 1/4"
                    percent={25}
                    status="Pending"
                    color="bg-amber-500"
                    logoColor="bg-[#2E6B65]"
                  />
                  <ClientRow 
                    name="Aura Wellness" 
                    url="aura.life"
                    platforms={['INSTAGRAM', 'YOUTUBE']}
                    package="Enterprise Suite"
                    progress="Milestone 4/5"
                    percent={85}
                    status="Paid"
                    color="bg-emerald-500"
                    logoColor="bg-[#EAE4D9]"
                  />
                </tbody>
              </table>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
                <button className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">Next</button>
              </div>
              <div className="flex items-center gap-1">
                <button className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm">1</button>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 font-medium text-sm">2</button>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 font-medium text-sm">3</button>
                <span className="px-2 text-gray-400">...</span>
                <button className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-700 font-medium text-sm">12</button>
              </div>
            </div>
          </div>

          {/* Bottom KPI Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">42</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                <DollarSign size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">$12,480</p>
              </div>
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                <ClipboardList size={20} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 leading-tight">18</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function ClientRow({ name, url, platforms, package: pkg, progress, percent, status, color, logoColor }: any) {
  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${logoColor}`}>
            {name.charAt(0)}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{url}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <div className="flex flex-wrap gap-1.5">
          {platforms.map((p: string) => (
            <span key={p} className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
              {p}
            </span>
          ))}
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="font-semibold text-gray-700 text-sm">{pkg}</span>
      </td>
      <td className="px-6 py-4 w-48">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs font-semibold text-gray-500">{progress}</span>
          <span className="text-xs font-bold text-indigo-600">{percent}%</span>
        </div>
        <div className="w-full bg-indigo-50 rounded-full h-1.5">
          <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${percent}%` }}></div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${status === 'Paid' ? 'bg-emerald-600' : 'bg-amber-600'}`}></div>
          {status}
        </span>
      </td>
      <td className="px-6 py-4">
        <div className="flex justify-center -space-x-2 overflow-hidden">
          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">JD</div>
          <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600">SM</div>
        </div>
      </td>
      <td className="px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-gray-400 hover:text-indigo-600 bg-white rounded shadow-sm border border-gray-100 transition-colors"><Eye size={16} /></button>
          <button className="p-1.5 text-gray-400 hover:text-indigo-600 bg-white rounded shadow-sm border border-gray-100 transition-colors"><Edit2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}
