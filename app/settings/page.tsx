import prisma from "@/lib/prisma";
import { Topbar } from "@/components/Topbar";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Shield, 
  Mail, 
  Lock, 
  Plus, 
  MoreHorizontal,
  Settings as SettingsIcon,
  Bell,
  CheckCircle2,
  Trash2,
  Server,
  Key,
  Database
} from "lucide-react";
import Link from "next/link";

export default async function SettingsPage() {
  const users = await prisma.user.findMany();

  return (
    <>
      <Topbar title="System Configuration" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          <div className="flex items-center gap-1.5 p-1.5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden whitespace-nowrap w-fit">
             <TabItem label="TEAM OPS" icon={<Users size={18} />} active />
             <TabItem label="ALERTS" icon={<Bell size={18} />} />
             <TabItem label="SECURITY PROTOCOL" icon={<Shield size={18} />} />
             <TabItem label="INFRASTRUCTURE" icon={<Database size={18} />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             
             {/* Team List */}
             <div className="lg:col-span-2 space-y-10">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden border-t-8 border-t-indigo-600">
                   <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
                      <div>
                         <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Active Operatives</h3>
                         <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1 opacity-60">System Access Control List // {users.length} Active</p>
                      </div>
                      <button className="px-8 py-3.5 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 italic flex items-center gap-2">
                         <Plus size={18} /> Deploy Invite
                      </button>
                   </div>
                   <div className="divide-y divide-gray-50">
                      {users.length === 0 ? (
                        <div className="p-24 text-center text-gray-300 font-black uppercase tracking-widest text-xs">No operatives initialized.</div>
                      ) : (
                        users.map(user => (
                          <div key={user.id} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-all group">
                             <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-700 font-black italic text-xl shadow-inner group-hover:scale-110 transition-transform">
                                   {user.name?.charAt(0)}
                                </div>
                                <div>
                                   <div className="flex items-center gap-3">
                                      <p className="font-black text-gray-900 text-lg uppercase italic tracking-tight">{user.name}</p>
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                   </div>
                                   <p className="text-xs text-gray-400 font-bold tracking-tight lowercase">{user.email}</p>
                                </div>
                             </div>
                             <div className="flex items-center gap-10">
                                <Badge className={`font-black italic text-[10px] uppercase tracking-widest px-3 py-1 ring-4 ${user.role === 'ADMIN' ? 'bg-indigo-600 text-white ring-indigo-50' : 'bg-gray-100 text-gray-500 ring-gray-50'}`}>
                                   {user.role}
                                </Badge>
                                <div className="flex items-center gap-2">
                                   <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all shadow-sm">
                                      <Lock size={18} />
                                   </button>
                                   <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all shadow-sm">
                                      <Trash2 size={18} />
                                   </button>
                                </div>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>

             {/* Side Command Panels */}
             <div className="space-y-10">
                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 border-t-8 border-t-gray-900">
                   <h3 className="text-xl font-black text-gray-900 mb-8 uppercase italic tracking-tight">Org Architecture</h3>
                   <div className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Agency Designation</label>
                         <input className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-black italic uppercase focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" defaultValue="AXION Marketing" />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Technical Support</label>
                         <input className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-inner" defaultValue="support@axion.com" />
                      </div>
                      <button className="w-full py-4.5 bg-gray-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-gray-200 mt-4 italic">
                         Commit Architecture
                      </button>
                   </div>
                </div>

                <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm p-10 flex flex-col gap-8 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-rose-100 transition-colors -z-10"></div>
                   <div className="flex items-center gap-4 text-rose-600">
                      <Key size={24} />
                      <h3 className="font-black text-lg uppercase italic tracking-tight">Access Protocol</h3>
                   </div>
                   <div className="p-6 bg-rose-50/50 rounded-2xl border border-rose-100">
                      <p className="text-xs text-rose-900 font-bold leading-relaxed italic uppercase tracking-tight">Admin Level Cleared. Internal API nodes active.</p>
                   </div>
                   <button className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-600 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all italic">
                      Purge API Tokens
                   </button>
                </div>
             </div>

          </div>

        </div>
      </div>
    </>
  );
}

function TabItem({ label, icon, active = false }: { label: string, icon: any, active?: boolean }) {
   return (
      <div className={`px-8 py-4 rounded-xl font-black text-[10px] tracking-widest uppercase italic flex items-center gap-3 transition-all cursor-pointer ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-50/50'}`}>
         {icon}
         {label}
      </div>
   )
}
