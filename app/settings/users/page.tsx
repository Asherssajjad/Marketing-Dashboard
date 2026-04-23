"use client";

import { useState, useEffect } from "react";
import { Topbar } from "@/components/Topbar";
import { Plus, UserPlus, Trash2, Shield, Mail, Loader2 } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "TEAM_MEMBER"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setFormData({ name: "", email: "", password: "", role: "TEAM_MEMBER" });
        fetchUsers();
      }
    } catch (err) {
      console.error("Failed to create user");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <>
      <Topbar title="User Management" breadcrumb="Settings > Users" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Create User Form */}
            <div className="w-full md:w-80 shrink-0">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-8">
                <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Add New Member</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-600 rounded-xl outline-none text-sm font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-600 rounded-xl outline-none text-sm font-medium"
                      placeholder="john@axion.com"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
                    <input 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-600 rounded-xl outline-none text-sm font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Role</label>
                    <select 
                      value={formData.role}
                      onChange={e => setFormData({...formData, role: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent focus:border-indigo-600 rounded-xl outline-none text-sm font-bold text-gray-600"
                    >
                      <option value="TEAM_MEMBER">Team Member</option>
                      <option value="MANAGER">Manager</option>
                      <option value="ADMIN">Administrator</option>
                    </select>
                  </div>
                  <button 
                    disabled={isCreating}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-[10px] uppercase tracking-[2px] transition-all shadow-lg shadow-indigo-100 mt-4 flex items-center justify-center gap-2"
                  >
                    {isCreating ? <Loader2 className="animate-spin" size={16} /> : <><UserPlus size={16}/> Create Account</>}
                  </button>
                </form>
              </div>
            </div>

            {/* User List */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Active Team Members</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {isLoading ? (
                    <div className="p-12 text-center text-gray-400 font-bold italic">Loading team...</div>
                  ) : users.length === 0 ? (
                    <div className="p-12 text-center text-gray-400 font-bold italic">No members found.</div>
                  ) : (
                    users.map((user: any) => (
                      <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-sm uppercase">
                            {user.name?.charAt(0) || user.email?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-400 font-medium">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'ADMIN' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                              {user.role}
                            </span>
                          </div>
                          <button className="text-gray-300 hover:text-rose-600 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
