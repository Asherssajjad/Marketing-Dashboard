"use client";

import { useState } from "react";
import { Zap, Command, ShieldCheck, ArrowRight, Lock, Mail, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Use requested credentials
    if (email === "ashersajjad98@gmai.com" && password === "AsherSajjad") {
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        setError("INVALID OPERATIVE CREDENTIALS");
      }, 1000);
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-50/50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-50/30 rounded-full -translate-x-1/2 translate-y-1/2 blur-3xl -z-10"></div>
      
      <div className="w-full max-w-[480px] space-y-10 relative z-10">
        
        {/* Brand Identity / Header */}
        <div className="flex flex-col items-center text-center space-y-4">
           <div className="w-20 h-20 rounded-[32px] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200 ring-8 ring-indigo-50 transform hover:rotate-12 transition-transform duration-500">
              <Zap size={36} fill="currentColor" />
           </div>
           <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tighter italic uppercase leading-none">AXION CONTROL</h1>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-3 opacity-60">System Security Protocol // Access Point</p>
           </div>
        </div>

        {/* Login Module */}
        <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-indigo-100/30 p-10 md:p-14 relative overflow-hidden group">
           <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-600 via-emerald-400 to-indigo-600"></div>
           
           <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                 
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic ml-1">Operative Designation (Email)</label>
                    <div className="relative group/input">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                       <input 
                          type="email" 
                          required 
                          placeholder="ADMIN@AXION.COM" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full pl-14 pr-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-inner"
                       />
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center ml-1">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Authorization Key</label>
                       <button type="button" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline italic">Key Recovery</button>
                    </div>
                    <div className="relative group/input">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-indigo-600 transition-colors" size={18} />
                       <input 
                          type={showPass ? "text" : "password"} 
                          required 
                          placeholder="••••••••••••••" 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full pl-14 pr-14 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-inner"
                       />
                       <button 
                          type="button" 
                          onClick={() => setShowPass(!showPass)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-900 transition-colors"
                        >
                          {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                    </div>
                 </div>

              </div>

              {error && (
                 <div className="bg-rose-50 border border-rose-100 px-4 py-3 rounded-xl text-[10px] font-black text-rose-600 uppercase tracking-widest text-center animate-shake">
                    {error}
                 </div>
              )}

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-5 bg-indigo-600 text-white font-black rounded-3xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 uppercase tracking-[0.2em] text-[11px] italic flex items-center justify-center gap-3 relative overflow-hidden group/btn"
              >
                {isLoading ? (
                   <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                   <>
                      <ShieldCheck size={18} className="group-hover:rotate-12 transition-transform" />
                      Decrypt & Access
                      <ArrowRight size={18} className="absolute right-8 transform group-hover:translate-x-2 transition-transform" />
                   </>
                )}
              </button>
           </form>

           <div className="mt-12 pt-8 border-t border-gray-50 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-[0.1em] italic">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={12} className="text-emerald-500" /> Secure Node 14
              </div>
              <div>System Version 4.0.2</div>
           </div>
        </div>

        {/* Footer Meta */}
        <div className="flex justify-center gap-8 text-[9px] font-black text-gray-300 uppercase tracking-widest italic opacity-50">
           <span className="hover:text-indigo-600 cursor-pointer transition-colors">Legal Terms</span>
           <span className="hover:text-indigo-600 cursor-pointer transition-colors">Privacy Node</span>
           <span className="hover:text-indigo-600 cursor-pointer transition-colors">Core Support</span>
        </div>

      </div>

    </div>
  );
}
