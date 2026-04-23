"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/Topbar";
import { 
  User as UserIcon, Building2, Bell, Shield, Laptop, Globe, Save, 
  Plus, UserPlus, Trash2, Loader2, AlertCircle, CheckCircle2, 
  Eye, EyeOff, Edit2, X, ShieldCheck, Mail, Smartphone, Monitor
} from "lucide-react";

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
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
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Edit State
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

  const fetchUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "team") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setStatusMsg(null);

    const isEdit = !!editingUser;
    const url = isEdit ? `/api/users/${editingUser.id}` : "/api/users";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (res.ok) {
        setUserFormData({ name: "", email: "", password: "", role: "TEAM_MEMBER" });
        setEditingUser(null);
        setStatusMsg({ type: 'success', text: isEdit ? "Account updated!" : "Account created!" });
        fetchUsers();
      } else {
        const errorText = await res.text();
        setStatusMsg({ type: 'error', text: errorText || "Failed to save" });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Connection error." });
    } finally {
      setIsCreating(false);
    }
  };

  const startEdit = (user: UserProfile) => {
    setEditingUser(user);
    setUserFormData({
      name: user.name || "",
      email: user.email || "",
      password: "", // Leave blank unless changing
      role: user.role
    });
    setActiveTab("team");
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
        setStatusMsg({ type: 'success', text: "Removed." });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Failed to delete." });
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
              <SettingsNavButton icon={<Bell size={18}/>} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
              <SettingsNavButton icon={<Laptop size={18}/>} label="Integrations" active={activeTab === "integrations"} onClick={() => setActiveTab("integrations")} />
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
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Agency Name</label>
                           <input type="text" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="AXION Marketing" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Support Email</label>
                           <input type="email" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm" defaultValue="ops@axion.com" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest">{editingUser ? 'Edit Member' : 'Add Member'}</h4>
                            {editingUser && (
                              <button onClick={() => {setEditingUser(null); setUserFormData({name:"",email:"",password:"",role:"TEAM_MEMBER"})}} className="text-gray-400 hover:text-gray-600"><X size={16}/></button>
                            )}
                          </div>
                          <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                            <input placeholder="Name" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.name} onChange={e => setUserFormData({...userFormData, name: e.target.value})} required />
                            <input placeholder="Email" type="email" className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.email} onChange={e => setUserFormData({...userFormData, email: e.target.value})} required />
                            <div className="relative">
                              <input 
                                type={showPassword ? "text" : "password"}
                                placeholder={editingUser ? "New Password (Optional)" : "Password"} 
                                minLength={6}
                                className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500 pr-10" 
                                value={userFormData.password}
                                onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                                required={!editingUser}
                              />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff size={16}/> : <Eye size={16}/>}
                              </button>
                            </div>
                            <select className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-600 outline-none focus:ring-1 focus:ring-indigo-500" value={userFormData.role} onChange={e => setUserFormData({...userFormData, role: e.target.value})}>
                              <option value="TEAM_MEMBER">Team Member</option>
                              <option value="MANAGER">Manager</option>
                              {currentUser?.role === 'ADMIN' && <option value="ADMIN">Administrator</option>}
                            </select>
                            <button disabled={isCreating} className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors">
                              {isCreating ? <Loader2 className="animate-spin" size={14}/> : (editingUser ? <Save size={14}/> : <UserPlus size={14}/>)}
                              {editingUser ? 'Update Account' : 'Create Account'}
                            </button>
                          </form>
                       </div>
                    </div>
                    <div className="md:col-span-2">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-gray-50 bg-gray-50/30"><h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Team</h4></div>
                          <div className="divide-y divide-gray-50">
                             {isLoadingUsers ? (
                               <div className="p-12 text-center flex flex-col items-center gap-2"><Loader2 className="animate-spin text-indigo-600" size={24}/><span className="text-xs font-bold text-gray-400">Syncing...</span></div>
                             ) : users.length === 0 ? (
                               <div className="p-12 text-center space-y-2"><p className="text-sm font-bold text-gray-900">No members found</p></div>
                             ) : (
                               users.map((user) => (
                               <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">{user.name?.charAt(0)}</div>
                                     <div><p className="text-sm font-bold text-gray-900">{user.name}</p><p className="text-[10px] text-gray-400 font-medium">{user.email}</p></div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>{user.role}</span>
                                    <button onClick={() => startEdit(user)} className="text-gray-300 hover:text-indigo-600 transition-colors p-1"><Edit2 size={16}/></button>
                                    {user.email !== currentUser?.email && (
                                      <button onClick={() => handleDeleteUser(user.id)} className="text-gray-300 hover:text-rose-600 transition-colors p-1"><Trash2 size={16} /></button>
                                    )}
                                  </div>
                               </div>
                             )))}
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
                      <SecurityToggle icon={<ShieldCheck size={20}/>} title="Two-Factor Authentication" desc="Add an extra layer of security to your account." />
                      <SecurityToggle icon={<Smartphone size={20}/>} title="Mobile Alerts" desc="Get notified of suspicious login attempts." />
                      <SecurityToggle icon={<Monitor size={20}/>} title="Session Management" desc="Log out from all other devices." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "notifications" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Notification Preferences</h3>
                    <div className="space-y-4">
                      <NotificationOption title="Email Reports" desc="Receive weekly performance summaries." />
                      <NotificationOption title="Task Updates" desc="Get notified when a task status changes." />
                      <NotificationOption title="Payment Alerts" desc="Notifications for successful/failed invoices." />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "integrations" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">Connected Apps</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <IntegrationCard name="WhatsApp API" desc="Send automated client reports." connected={true} />
                      <IntegrationCard name="Meta Ads" desc="Sync your ad campaign data." connected={false} />
                      <IntegrationCard name="Google Analytics" desc="Track website traffic." connected={false} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "branding" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Public Branding</h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                        <p className="text-sm font-bold text-indigo-900">White-labeling Active</p>
                        <p className="text-xs text-indigo-700 mt-1">Your clients see your agency branding, not AXION's.</p>
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Primary Color</label>
                         <div className="flex gap-2">
                            <div className="w-10 h-10 rounded-lg bg-indigo-600 border border-white shadow-sm"></div>
                            <input type="text" className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm w-32" defaultValue="#4F46E5" />
                         </div>
                      </div>
                    </div>
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

function SecurityToggle({ icon, title, desc }: any) {
  return (
    <div className="py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-indigo-600">{icon}</div>
        <div><p className="text-sm font-bold text-gray-900">{title}</p><p className="text-xs text-gray-400">{desc}</p></div>
      </div>
      <div className="w-10 h-5 bg-gray-200 rounded-full relative cursor-pointer"><div className="w-4 h-4 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div></div>
    </div>
  );
}

function NotificationOption({ title, desc }: any) {
  return (
    <div className="flex items-start gap-3">
      <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
      <div><p className="text-sm font-bold text-gray-900">{title}</p><p className="text-xs text-gray-400">{desc}</p></div>
    </div>
  );
}

function IntegrationCard({ name, desc, connected }: any) {
  return (
    <div className="p-4 border border-gray-100 rounded-2xl hover:border-indigo-100 transition-colors flex items-center justify-between">
      <div><p className="text-sm font-bold text-gray-900">{name}</p><p className="text-xs text-gray-400">{desc}</p></div>
      <button className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${connected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
        {connected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
}
