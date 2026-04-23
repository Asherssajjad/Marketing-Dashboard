"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Topbar } from "@/components/Topbar";
import { User as UserIcon, Building2, Bell, Shield, Laptop, Globe, Save, Plus, UserPlus, Trash2, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

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

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userFormData),
      });

      if (res.ok) {
        setUserFormData({ name: "", email: "", password: "", role: "TEAM_MEMBER" });
        setStatusMsg({ type: 'success', text: "Team member created successfully!" });
        fetchUsers();
      } else {
        const errorText = await res.text();
        setStatusMsg({ type: 'error', text: errorText || "Failed to create user" });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Connection error. Please try again." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to remove this member?")) return;
    
    try {
      const res = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
        setStatusMsg({ type: 'success', text: "Member removed." });
      }
    } catch (err) {
      setStatusMsg({ type: 'error', text: "Failed to delete user." });
    }
  };

  return (
    <>
      <Topbar title="Platform Settings" breadcrumb={`Configuration > ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`} />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1100px] mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Settings Navigation */}
            <div className="lg:col-span-1 space-y-1">
              <SettingsNavButton icon={<Building2 size={18}/>} label="Agency Profile" active={activeTab === "agency"} onClick={() => setActiveTab("agency")} />
              <SettingsNavButton icon={<UserIcon size={18}/>} label="Team Members" active={activeTab === "team"} onClick={() => setActiveTab("team")} />
              <SettingsNavButton icon={<Shield size={18}/>} label="Security & Access" active={activeTab === "security"} onClick={() => setActiveTab("security")} />
              <SettingsNavButton icon={<Bell size={18}/>} label="Notifications" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
              <SettingsNavButton icon={<Laptop size={18}/>} label="Integrations" active={activeTab === "integrations"} onClick={() => setActiveTab("integrations")} />
              <SettingsNavButton icon={<Globe size={18}/>} label="Public Branding" active={activeTab === "branding"} onClick={() => setActiveTab("branding")} />
            </div>

            {/* Settings Content */}
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
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                     <button className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-sm shadow-indigo-100">
                        <Save size={18} /> Save Profile
                     </button>
                  </div>
                </div>
              )}

              {activeTab === "team" && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
                          <h4 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Add Member</h4>
                          <form onSubmit={handleCreateUser} className="space-y-4">
                            <input 
                              placeholder="Name" 
                              className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" 
                              value={userFormData.name}
                              onChange={e => setUserFormData({...userFormData, name: e.target.value})}
                              required
                            />
                            <input 
                              placeholder="Email" 
                              type="email"
                              className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" 
                              value={userFormData.email}
                              onChange={e => setUserFormData({...userFormData, email: e.target.value})}
                              required
                            />
                            <div className="space-y-1">
                              <input 
                                type="password"
                                placeholder="Password" 
                                minLength={6}
                                className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-medium outline-none focus:ring-1 focus:ring-indigo-500" 
                                value={userFormData.password}
                                onChange={e => setUserFormData({...userFormData, password: e.target.value})}
                                required
                              />
                              <p className="text-[9px] text-gray-400 ml-1">Min 6 characters</p>
                            </div>
                            <select 
                              className="w-full px-3 py-2 bg-gray-50 border-none rounded-lg text-sm font-bold text-gray-600 outline-none focus:ring-1 focus:ring-indigo-500"
                              value={userFormData.role}
                              onChange={e => setUserFormData({...userFormData, role: e.target.value})}
                            >
                              <option value="TEAM_MEMBER">Team Member</option>
                              <option value="MANAGER">Manager</option>
                              {currentUser?.role === 'ADMIN' && <option value="ADMIN">Administrator</option>}
                            </select>
                            <button 
                              disabled={isCreating}
                              className="w-full py-3 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                              {isCreating ? <Loader2 className="animate-spin" size={14}/> : <UserPlus size={14}/>}
                              Create Account
                            </button>
                          </form>
                       </div>
                    </div>
                    <div className="md:col-span-2">
                       <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
                             <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Team</h4>
                          </div>
                          <div className="divide-y divide-gray-50">
                             {isLoadingUsers ? (
                               <div className="p-12 text-center flex flex-col items-center gap-2">
                                  <Loader2 className="animate-spin text-indigo-600" size={24}/>
                                  <span className="text-xs font-bold text-gray-400 italic">Syncing with database...</span>
                               </div>
                             ) : users.length === 0 ? (
                               <div className="p-12 text-center space-y-2">
                                  <p className="text-sm font-bold text-gray-900">No members found</p>
                                  <p className="text-xs text-gray-400">Start by adding your first employee.</p>
                               </div>
                             ) : (
                               users.map((user) => (
                               <div key={user.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                                  <div className="flex items-center gap-3">
                                     <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs uppercase">{user.name?.charAt(0)}</div>
                                     <div>
                                        <p className="text-sm font-bold text-gray-900">{user.name}</p>
                                        <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
                                     </div>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                       {user.role}
                                    </span>
                                    {user.email !== currentUser?.email && (
                                      <button 
                                        onClick={() => handleDeleteUser(user.id)}
                                        className="text-gray-300 hover:text-rose-600 transition-colors p-1"
                                      >
                                        <Trash2 size={16} />
                                      </button>
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

              {activeTab !== "agency" && activeTab !== "team" && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center space-y-4 animate-in fade-in duration-300">
                   <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-300 mx-auto">
                      <Shield size={32} />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900">Module Coming Soon</h3>
                     <p className="text-sm text-gray-500">We are currently building this settings module.</p>
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
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-gray-500 hover:bg-gray-100'}`}
    >
       {icon} {label}
    </button>
  );
}
