"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/Topbar";
import { 
  User as UserIcon, Building2, Shield, Globe, Save, 
  Plus, UserPlus, Trash2, Loader2, AlertCircle, CheckCircle2, 
  Eye, EyeOff, Edit2, X, ShieldCheck, Smartphone, Monitor, Palette, Upload
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
}

interface AgencySettings {
  agencyName: string;
  supportEmail: string;
  primaryColor: string;
  logoUrl: string | null;
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export default function SettingsPage() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  
  const [activeTab, setActiveTab] = useState("agency");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Settings State
  const [settings, setSettings] = useState<AgencySettings>({
    agencyName: "AXION Marketing",
    supportEmail: "ops@axion.com",
    primaryColor: "#4F46E5",
    logoUrl: null
  });

  // Edit User State
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  // Feedback States
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // User Form State
  const [userFormData, setUserFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER"
  });

  // Fetch Settings & Users
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      // Fetch Users
      if (activeTab === "team") {
        const res = await fetch("/api/users");
        if (res.ok) setUsers(await res.json());
      }
      // Fetch Settings
      const setRes = await fetch("/api/settings");
      if (setRes.ok) setSettings(await setRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setStatusMsg({ type: 'success', text: "Settings saved successfully!" });
      } else {
        throw new Error();
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Failed to save settings." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateOrUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setStatusMsg(null);

    const isEdit = !!editingUser;
    const url = isEdit ? `/api/users/${editingUser.id}` : "/api/users";
    
    try {
      const res = await fetch(url, {
        method: isEdit ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (res.ok) {
        setUserFormData({ name: "", email: "", password: "", role: "TEAM_MEMBER" });
        setEditingUser(null);
        setStatusMsg({ type: 'success', text: isEdit ? "Account updated!" : "Account created!" });
        fetchData();
      } else {
        const errorText = await res.text();
        setStatusMsg({ type: 'error', text: errorText || "Failed to save" });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Connection error." });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <Topbar title="Platform Settings" breadcrumb={`Configuration > ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            <div className="lg:col-span-1 space-y-1">
              <SettingsNavButton icon={<Building2 size={18}/>} label="Agency Profile" active={activeTab === "agency"} onClick={() => setActiveTab("agency")} />
              <SettingsNavButton icon={<UserIcon size={18}/>} label="Team Members" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
              <SettingsNavButton icon={<Shield size={18}/>} label="Security & Access" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
              <SettingsNavButton icon={<Globe size={18}/>} label="Public Branding" active={activeTab === "branding"} onClick={() => setActiveTab("branding")} />
            </div>

            <div className="lg:col-span-3 space-y-6">
              {statusMsg && (
                <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${statusMsg.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                  {statusMsg.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
                  {statusMsg.text}
                </div>
              )}

              {activeTab === "agency" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Agency Identity</h3>
                      <p className="text-sm text-gray-500">How your brand appears to your team and clients.</p>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agency Name</label>
                           <input 
                             type="text" 
                             className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                             value={settings.agencyName} 
                             onChange={(e) => setSettings({...settings, agencyName: e.target.value})}
                           />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</label>
                           <input 
                             type="email" 
                             className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-indigo-500 outline-none" 
                             value={settings.supportEmail} 
                             onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                           />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                   {/* ... Same Team Section UI ... */}
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{editingUser ? 'Edit Member' : 'Add Member'}</h4>
                            {editingUser && <button onClick={() => {setEditingUser(null); setUserFormData({name:"",email:"",password:"",role:"TEAM_MEMBER"})}}><X size={16}/></button>}
                          </div>
                          <form onSubmit={handleCreateOrUpdateUser} className="space-y-4">
                            <input placeholder="Name" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} required />
                            <input placeholder="Email" type="email" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} required />
                            <div className="relative">
                              <input type={showPassword ? "text" : "password"} placeholder={editingUser ? "New Password (Optional)" : "Password"} minLength={6} className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500 pr-10" value={userFormData.password} onChange={e => setUserFormData({...userFormData, password: e.target.value})} required={!editingUser} />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}</button>
                            </div>
                            <select className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-600 outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})}>
                              <option value="TEAM_MEMBER">Team Member</option>
                              <option value="MANAGER">Manager</option>
                              {currentUser?.role === 'ADMIN' && <option value="ADMIN">Administrator</option>}
                            </select>
                            <button disabled={isSaving} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                              {isSaving ? <Loader2 className="animate-spin" size={14}/> : (editingUser ? <Save size={14}/> : <UserPlus size={14}/>)}
                              {editingUser ? 'Update Account' : 'Create Account'}
                            </button>
                          </form>
                       </div>
                    </div>
                    <div className="md:col-span-2">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-gray-50 bg-gray-50/30"><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Team</h4></div>
                          <div className="divide-y divide-gray-50">
                             {isLoading ? (
                               <div className="p-12 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin text-indigo-600" size={24}/></div>
                             ) : users.map((user) => (
                               <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">{user.name?.charAt(0)}</div>
                                     <div><p className="text-sm font-bold text-gray-900">{user.name}</p><p className="text-[10px] text-gray-400 font-medium">{user.email}</p></div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{user.role}</span>
                                    <button onClick={() => {setEditingUser(user); setUserFormData({name: user.name||"", email: user.email||"", password: "", role: user.role})}} className="text-gray-300 hover:text-indigo-600 transition-colors p-1"><Edit2 size={16}/></button>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Security & Access</h3>
                    <div className="divide-y divide-gray-50">
                      <div className="py-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center"><ShieldCheck size={20}/></div>
                          <div><p className="text-sm font-bold text-gray-900">Two-Factor Authentication</p><p className="text-xs text-gray-400">Secure your account with an extra login step.</p></div>
                        </div>
                        <button className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold hover:bg-rose-100 transition-colors">Connect 2FA</button>
                      </div>
                      <div className="py-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Smartphone size={20}/></div>
                          <div><p className="text-sm font-bold text-gray-900">Mobile Login History</p><p className="text-xs text-gray-400">Track all active mobile sessions.</p></div>
                        </div>
                        <button className="text-xs font-bold text-indigo-600">View Logs</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "branding" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                      <h3 className="text-lg font-bold text-gray-900">Public Branding</h3>
                      <p className="text-sm text-gray-500">Customize the colors and logo of your agency portal.</p>
                    </div>
                    <div className="p-6 space-y-8">
                      <div className="flex items-center gap-6">
                         <div className="w-24 h-24 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer">
                            <Upload size={24} />
                            <span className="text-[10px] font-bold mt-2">Upload Logo</span>
                         </div>
                         <div>
                            <h4 className="text-sm font-bold text-gray-800">Agency Logo</h4>
                            <p className="text-xs text-gray-400 mt-1">Recommended: 512x512px SVG or PNG.</p>
                         </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Brand Color Theme</label>
                        <div className="flex items-center gap-4">
                          <input 
                            type="color" 
                            className="w-12 h-12 rounded-xl cursor-pointer border-none p-0" 
                            value={settings.primaryColor} 
                            onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          />
                          <input 
                            type="text" 
                            className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono w-32" 
                            value={settings.primaryColor}
                            onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSaveSettings}
                      disabled={isSaving}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-100"
                    >
                      {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                      Save Branding
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SettingsNavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'}`}>
       {icon} {label}
    </button>
  );
}
