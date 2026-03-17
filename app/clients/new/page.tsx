import { Topbar } from "@/components/Topbar";
import { createClient } from "@/app/actions/clients";
import Link from "next/link";
import { Plus, Users, Zap, DollarSign, Target, Settings, ArrowLeft } from "lucide-react";

export default function NewClientPage() {
  return (
    <>
      <Topbar title="Partner Acquisition" breadcrumb="Clients" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1000px] mx-auto">
          
          <Link href="/clients" className="inline-flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest mb-8 hover:text-indigo-600 transition-colors group">
             <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Intelligence
          </Link>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl shadow-indigo-100/20 overflow-hidden">
            <div className="bg-indigo-600 p-10 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
               <div className="relative z-10">
                  <h2 className="text-3xl font-black italic uppercase tracking-tight">Onboard New Partner</h2>
                  <p className="text-indigo-100 font-bold mt-2 opacity-80 uppercase tracking-widest text-xs">Initialize operations for a new agency client</p>
               </div>
            </div>

            <form action={createClient} className="p-10 space-y-12">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase italic">Partner Identity</h3>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">Core information about the organization and primary contact point.</p>
                 </div>
                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Name *</label>
                      <input name="name" required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic uppercase transition-all shadow-inner" placeholder="E.G. ACME LUXURY" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Contact Email</label>
                      <input name="contact" type="email" className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold transition-all shadow-inner" placeholder="contact@acme.com" />
                    </div>
                    <div className="col-span-2 space-y-2 pt-4">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Target Ecosystems</label>
                      <div className="flex flex-wrap gap-3">
                        {["INSTAGRAM", "TIKTOK", "FACEBOOK", "LINKEDIN", "YOUTUBE"].map(platform => (
                          <label key={platform} className="flex items-center gap-3 cursor-pointer group bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
                            <input type="checkbox" name="platforms" value={platform} className="w-4 h-4 text-indigo-600 rounded-md border-gray-300 focus:ring-indigo-500" />
                            <span className="text-xs text-gray-700 font-black uppercase tracking-tight group-hover:text-indigo-600 italic">{platform}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                 </div>
              </div>

              <div className="h-px bg-gray-50"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 <div className="space-y-2">
                    <h3 className="text-lg font-black text-gray-900 uppercase italic">SLA Configuration</h3>
                    <p className="text-xs text-gray-400 font-bold leading-relaxed">Define the recurring service levels and financial commitments.</p>
                 </div>
                 <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SLA Designation *</label>
                      <input name="package" required className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic uppercase transition-all shadow-inner" placeholder="E.G. CONTENT ACCELERATOR" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Monthly Commitment ($)</label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input name="price" type="number" step="0.01" className="w-full pl-10 pr-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic transition-all shadow-inner" placeholder="2500" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reels Vol. / Mo</label>
                      <input name="reels_pm" type="number" defaultValue={8} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic transition-all shadow-inner" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Static Vol. / Mo</label>
                      <input name="posts_pm" type="number" defaultValue={12} className="w-full px-5 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black italic transition-all shadow-inner" />
                    </div>
                 </div>
              </div>

              <div className="flex justify-end gap-6 pt-10">
                <Link href="/clients" className="px-8 py-4 text-gray-400 font-black rounded-2xl text-xs uppercase tracking-widest hover:text-gray-900 transition-all italic border border-transparent">
                  Decline Onboarding
                </Link>
                <button type="submit" className="px-12 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 uppercase tracking-widest text-xs italic">
                  Complete Initialization
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
