import { Topbar } from "@/components/Topbar";
import { getClients } from "@/app/actions/clients";
import { createProject } from "@/app/actions/projects";
import Link from "next/link";
import { Briefcase, Users, Calendar, Settings, ArrowLeft, Layout, Rocket } from "lucide-react";

export default async function NewProjectPage() {
  const clients = await getClients();

  return (
    <>
      <Topbar title="Pipeline Initialization" breadcrumb="Projects" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[900px] mx-auto">
          
          <Link href="/projects" className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-8 hover:text-indigo-600 transition-colors group italic">
             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Kanban
          </Link>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-indigo-100/30 overflow-hidden">
            <div className="bg-indigo-600 p-12 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full translate-x-40 -translate-y-40 blur-3xl"></div>
               <div className="relative z-10 flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/20">
                     <Rocket size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black italic uppercase tracking-tight leading-none">Initialize Project</h2>
                    <p className="text-indigo-100 font-bold mt-2 opacity-80 uppercase tracking-widest text-[10px]">Configure new development operation</p>
                  </div>
               </div>
            </div>

            <form action={createProject} className="p-12 space-y-12">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-3">
                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Core Intel</h3>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">Fundamental project specs and partner assignment.</p>
                 </div>
                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="col-span-2 space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Project Name *</label>
                      <input name="name" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic uppercase transition-all shadow-inner" placeholder="E.G. GLOBAL REDESIGN 2024" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Partner Assignment *</label>
                      <select name="clientId" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold uppercase italic transition-all shadow-inner cursor-pointer appearance-none">
                        <option value="">SELECT PARTNER</option>
                        {clients.map(client => (
                          <option key={client.id} value={client.id}>{client.name.toUpperCase()}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Operation Type *</label>
                      <select name="type" required className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold uppercase italic transition-all shadow-inner cursor-pointer appearance-none">
                        <option value="WEBSITE">WEBSITE</option>
                        <option value="LANDING_PAGE">LANDING PAGE</option>
                        <option value="REDESIGN">REDESIGN</option>
                        <option value="E-COMMERCE">E-COMMERCE</option>
                      </select>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-gray-50"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                 <div className="space-y-3">
                    <h3 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Timeline & Phase</h3>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">Establish the initial status and delivery deadline.</p>
                 </div>
                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Initial Phase</label>
                      <select name="status" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold uppercase italic transition-all shadow-inner cursor-pointer appearance-none">
                        <option value="DISCOVERY">DISCOVERY</option>
                        <option value="DESIGN">DESIGN</option>
                        <option value="DEVELOPMENT">DEVELOPMENT</option>
                        <option value="REVIEW">REVIEW</option>
                        <option value="TESTING">TESTING</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Target Deadline</label>
                      <input name="dueDate" type="date" className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all shadow-inner" />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-6 pt-12">
                <Link href="/projects" className="px-10 py-4 text-gray-400 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:text-gray-900 transition-all italic border border-transparent">
                  Abort Mission
                </Link>
                <button type="submit" className="px-16 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs italic flex items-center gap-2">
                  <Rocket size={16} /> Deploy Project
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
