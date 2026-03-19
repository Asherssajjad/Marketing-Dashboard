import { Topbar } from "@/components/Topbar";
import { DollarSign, Plus, CheckCircle2, AlertTriangle, FileText, ArrowRight } from "lucide-react";
import { getPayments, updatePaymentStatus } from "@/app/actions/payments";
import { getClients } from "@/app/actions/clients";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export default async function PaymentsPage() {
  const payments = await getPayments();
  const clients = await getClients();

  return (
    <>
      <Topbar title="Financials & Invoicing" breadcrumb="Payments" />

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialStat label="TOTAL PENDING" value={`$${payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`} icon={<Clock size={18}/>} color="text-amber-600" bgColor="bg-amber-50" />
            <FinancialStat label="COLLECTED (MTD)" value={`$${payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`} icon={<CheckCircle2 size={18}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <FinancialStat label="OVERDUE" value="$0" icon={<AlertTriangle size={18}/>} color="text-rose-600" bgColor="bg-rose-50" />
            <FinancialStat label="PROJECTED" value={`$${payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}`} icon={<DollarSign size={18}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Invoices & Billing</h3>
              <NewPaymentButton clients={clients} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Invoice #</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Client</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Period</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {payments.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium">No financial records found.</td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <PaymentRow key={p.id} payment={p} />
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

function FinancialStat({ label, value, icon, color, bgColor }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${bgColor} ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function NewPaymentButton({ clients }: any) {
  return (
    <div className="group relative">
      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-bold transition-all shadow-sm">
        <Plus size={16} /> New Invoice
      </button>
      {/* For a real app we'd use a modal here, but for now we'll keep it simple */}
    </div>
  );
}

import { Clock } from "lucide-react";

function PaymentRow({ payment }: any) {
  const statusStyles: any = {
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    OVERDUE: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
             <FileText size={14} />
          </div>
          <span className="text-sm font-bold text-gray-900">{payment.invoices[0]?.invoiceNo || "N/A"}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-gray-600">{payment.client?.name}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-gray-900">${payment.amount.toLocaleString()}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold text-gray-400 uppercase">{new Date(payment.year, payment.month-1).toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
      </td>
      <td className="px-6 py-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border ${statusStyles[payment.status]}`}>
          {payment.status}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <button className="text-gray-400 hover:text-indigo-600 transition-colors">
          <ArrowRight size={18} />
        </button>
      </td>
    </tr>
  );
}
