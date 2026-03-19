import { Topbar } from "@/components/Topbar";
import { User, Building2, Bell, Shield, Laptop, Globe, Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Platform Settings" breadcrumb="Configuration" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Settings Navigation */}
            <div className="lg:col-span-1 space-y-1">
              <SettingsLink icon={<Building2 size={18}/>} label="Agency Profile" active />
              <SettingsLink icon={<User size={18}/>} label="Team Members" />
              <SettingsLink icon={<Shield size={18}/>} label="Security & Access" />
              <SettingsLink icon={<Bell size={18}/>} label="Notifications" />
              <SettingsLink icon={<Laptop size={18}/>} label="Integrations" />
              <SettingsLink icon={<Globe size={18}/>} label="Public Branding" />
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Agency Identity</h3>
                  <p className="text-sm text-gray-500">Configure how AXION represents your brand to clients.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agency Name</label>
                       <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" defaultValue="AXION Marketing" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</label>
                       <input type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all" defaultValue="ops@axion.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">System Language</label>
                    <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all">
                       <option>English (US)</option>
                       <option>Spanish</option>
                       <option>French</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Visual Branding</h3>
                  <p className="text-sm text-gray-500">Customize the look of your client-facing portal.</p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-6">
                     <div className="w-20 h-20 bg-indigo-50 rounded-2xl border-2 border-dashed border-indigo-200 flex items-center justify-center text-indigo-400 group cursor-pointer hover:bg-indigo-100/50 transition-colors">
                        <Plus size={24} />
                     </div>
                     <div>
                        <h4 className="text-sm font-bold text-gray-800">Agency Logo</h4>
                        <p className="text-xs text-gray-400 mt-1">Recommended: 400x400px, PNG or SVG.</p>
                        <button className="mt-3 px-4 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">Replace Logo</button>
                     </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                 <button className="px-6 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
                 <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-indigo-100">
                    <Save size={18} /> Save Changes
                 </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsLink({ icon, label, active }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-gray-500 hover:bg-gray-100'}`}>
       {icon} {label}
    </button>
  );
}

import { Plus } from "lucide-react";
