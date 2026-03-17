import { Topbar } from "@/components/Topbar";
import { getPayments, updatePaymentStatus, createInvoice } from "@/app/actions/payments";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  FileText, 
  MoreVertical, 
  ArrowUpRight, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  CreditCard,
  TrendingUp,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default async function PaymentsPage() {
  const payments = await getPayments();

  const totalReceived = payments.filter(p => p.status === 'PAID').reduce((acc, p) => acc + p.amount, 0);
  const pendingAmount = payments.filter(p => p.status === 'PENDING').reduce((acc, p) => acc + p.amount, 0);
  const overdueBalance = payments.filter(p => p.status === 'OVERDUE').reduce((acc, p) => acc + p.amount, 0);

  return (
    <>
      <Topbar title="Financial Intelligence" breadcrumb="AXION" />
      
      <div className="flex-1 overflow-auto p-4 md:p-8 bg-[#F9FAFB]">
        <div className="max-w-[1400px] mx-auto space-y-10">
          
          {/* Header Action Row */}
          <div className="flex flex-col lg:row justify-between items-start lg:items-center gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-full translate-x-32 -translate-y-32 blur-3xl"></div>
             <div className="relative z-10">
               <h1 className="text-3xl font-black text-gray-900 tracking-tight italic uppercase">Billing & Ledger</h1>
               <p className="text-sm text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1 opacity-60">Real-time revenue monitoring // System Version 2.0</p>
             </div>
             <div className="flex items-center gap-4 relative z-10">
                <div className="relative group hidden md:block">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
                   <input className="pl-11 pr-5 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 w-72 transition-all shadow-inner" placeholder="Search invoices..." />
                </div>
                <button className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all shadow-sm">
                   <Filter size={20} />
                </button>
             </div>
          </div>

          {/* KPI Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StatsCard label="TOTAL REALIZED" value={`$${totalReceived.toLocaleString()}`} icon={<CheckCircle size={24} />} color="text-emerald-600" bgColor="bg-emerald-50" trend="+8.4%" positive />
            <StatsCard label="PENDING PIPELINE" value={`$${pendingAmount.toLocaleString()}`} icon={<Clock size={24} />} color="text-amber-600" bgColor="bg-amber-50" trend="Active" positive />
            <StatsCard label="OVERDUE LIABILITIES" value={`$${overdueBalance.toLocaleString()}`} icon={<AlertCircle size={24} />} color="text-rose-600" bgColor="bg-rose-50" trend="Critical" positive={overdueBalance === 0} />
          </div>

          {/* Payments Infrastructure */}
          <div className="bg-white border border-gray-100 rounded-[32px] shadow-sm overflow-hidden border-t-8 border-t-indigo-600">
            <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
               <h3 className="text-lg font-black text-gray-900 uppercase italic tracking-widest">Transaction History</h3>
               <button className="px-6 py-2.5 bg-indigo-600 text-white font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 italic flex items-center gap-2">
                  <Download size={14} /> Export Master Ledger
               </button>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-white border-b border-gray-50 text-[10px] uppercase tracking-[0.2em] text-gray-300 font-black">
                        <th className="px-8 py-6">Partner</th>
                        <th className="px-8 py-6">Billing Cycle</th>
                        <th className="px-8 py-6">Amount</th>
                        <th className="px-8 py-6 text-center">Protocol Status</th>
                        <th className="px-8 py-6">Invoice ID</th>
                        <th className="px-8 py-6 text-right">Ops</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 font-bold text-sm bg-white">
                     {payments.length === 0 ? (
                       <tr>
                          <td colSpan={6} className="px-8 py-24 text-center">
                             <div className="flex flex-col items-center gap-4 text-gray-200">
                                <CreditCard size={64} className="stroke-1" />
                                <p className="font-black uppercase tracking-widest text-xs">No transaction history detected</p>
                             </div>
                          </td>
                       </tr>
                     ) : (
                       payments.map((p) => (
                         <tr key={p.id} className="hover:bg-gray-50/50 transition-all group">
                            <td className="px-8 py-6">
                               <div className="flex items-center gap-5">
                                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black text-lg italic shadow-inner">
                                     {p.client?.name.charAt(0)}
                                  </div>
                                  <div>
                                     <p className="font-black text-gray-900 uppercase italic tracking-tight group-hover:text-indigo-600 transition-colors">{p.client?.name}</p>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">SLA Level: Premium</p>
                                  </div>
                               </div>
                            </td>
                            <td className="px-8 py-6 text-gray-500 uppercase italic tracking-tighter">
                               {new Date(0, p.month - 1).toLocaleString('default', { month: 'short' })} {p.year}
                            </td>
                            <td className="px-8 py-6 text-gray-900 font-black text-lg italic">
                               ${p.amount.toLocaleString()}
                            </td>
                            <td className="px-8 py-6 text-center">
                               <StatusBadge status={p.status} />
                            </td>
                            <td className="px-8 py-6">
                               {p.invoices.length > 0 ? (
                                 <div className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors cursor-pointer font-black text-xs italic uppercase tracking-widest">
                                    <FileText size={16} /> {p.invoices[0].invoiceNo}
                                 </div>
                               ) : (
                                 <form action={async () => { "use server"; await createInvoice(p.id) }}>
                                    <button type="submit" className="text-[10px] font-black text-gray-400 border-2 border-dashed border-gray-100 px-4 py-2 rounded-xl hover:border-indigo-300 hover:text-indigo-600 uppercase tracking-widest transition-all italic bg-gray-50/50">Initialize</button>
                                 </form>
                                )}
                            </td>
                            <td className="px-8 py-6 text-right">
                               <div className="flex justify-end gap-3">
                                  <form action={async () => { "use server"; await updatePaymentStatus(p.id, "PAID") }}>
                                     <button type="submit" className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-all shadow-sm border border-transparent hover:border-emerald-100 group-hover:translate-x-0">
                                        <CheckCircle size={18} />
                                     </button>
                                  </form>
                                  <button className="w-10 h-10 flex items-center justify-center bg-gray-50 text-gray-300 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all shadow-sm group-hover:translate-x-0">
                                     <MoreVertical size={18} />
                                  </button>
                               </div>
                            </td>
                         </tr>
                       ))
                     )}
                  </tbody>
               </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

function StatsCard({ label, value, icon, color, bgColor, trend, positive }: any) {
   return (
      <div className="bg-white border border-gray-100 rounded-[32px] p-8 shadow-sm group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-indigo-50/30 transition-colors -z-10"></div>
         <div className="flex items-center justify-between mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 transition-transform group-hover:scale-110 ${bgColor} ${color}`}>
              {icon}
            </div>
            <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase italic shadow-sm ${positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
               <TrendingUp size={12} /> {trend}
            </div>
         </div>
         <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 opacity-60 italic">{label}</p>
            <p className="text-3xl font-black text-gray-900 leading-none tracking-tighter italic">{value}</p>
         </div>
      </div>
   )
}

function StatusBadge({ status }: { status: string }) {
   if (status === 'PAID') return <Badge className="bg-emerald-500 text-white border-none font-black tracking-widest text-[9px] px-3 py-1 uppercase italic shadow-sm ring-4 ring-emerald-50/50">Paid</Badge>;
   if (status === 'PENDING') return <Badge className="bg-amber-100 text-amber-700 border-none font-black tracking-widest text-[9px] px-3 py-1 uppercase italic shadow-sm ring-4 ring-amber-50/50">Pending</Badge>;
   if (status === 'OVERDUE') return <Badge className="bg-rose-500 text-white border-none font-black tracking-widest text-[9px] px-3 py-1 uppercase italic shadow-sm ring-4 ring-rose-50/50 animate-pulse">Overdue</Badge>;
   return <Badge className="bg-gray-100 text-gray-500">{status}</Badge>;
}
