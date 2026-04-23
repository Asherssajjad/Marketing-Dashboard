import { Topbar } from "@/components/Topbar";
import { DollarSign, CheckCircle2, AlertTriangle, FileText, ArrowRight, Clock } from "lucide-react";
import { getPayments, updatePaymentStatus } from "@/app/actions/payments";
import { getClients } from "@/app/actions/clients";
import NewInvoiceModal from "./NewInvoiceModal";

interface FinancialStatProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

interface PaymentRowProps {
  payment: any;
}

export default async function PaymentsPage() {
  let payments: any[] = [];
  let clients: any[] = [];
  let error: string | null = null;

  try {
    const [paymentsData, clientsData] = await Promise.all([
      getPayments(),
      getClients()
    ]);
    payments = paymentsData;
    clients = clientsData;
  } catch (err) {
    console.error("[PAYMENTS_PAGE_DATA_ERROR]", err);
    error = "Unable to load financial data. Please ensure you have administrative permissions.";
  }

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  // Helper for Decimal arithmetic
  const getAmount = (p: any) => Number(p.amount) || 0;

  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + getAmount(p), 0);

  const collectedMTD = payments
    .filter(p => p.status === 'PAID' && p.month === currentMonth && p.year === currentYear)
    .reduce((sum, p) => sum + getAmount(p), 0);
    
  const overdueAmount = payments
    .filter(p => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + getAmount(p), 0);

  return (
    <>
      <Topbar title="Financials & Invoicing" breadcrumb="Payments" />

      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialStat label="TOTAL PENDING" value={`$${totalPending.toLocaleString()}`} icon={<Clock size={18}/>} color="text-amber-600" bgColor="bg-amber-50" />
            <FinancialStat label="COLLECTED (MTD)" value={`$${collectedMTD.toLocaleString()}`} icon={<CheckCircle2 size={18}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <FinancialStat label="OVERDUE" value={`$${overdueAmount.toLocaleString()}`} icon={<AlertTriangle size={18}/>} color="text-rose-600" bgColor="bg-rose-50" />
            <FinancialStat label="PROJECTED" value={`$${(totalPending + collectedMTD).toLocaleString()}`} icon={<DollarSign size={18}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Invoices & Billing</h3>
              <NewInvoiceModal clients={clients} />
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
                       <td colSpan={6} className="px-6 py-12 text-center text-gray-400 italic font-medium">
                         {error ? "No data available." : "No financial records found."}
                       </td>
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

function FinancialStat({ label, value, icon, color, bgColor }: FinancialStatProps) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
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

function PaymentRow({ payment }: PaymentRowProps) {
  const statusStyles: Record<string, string> = {
    PAID: "bg-emerald-50 text-emerald-600 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-600 border-amber-100",
    OVERDUE: "bg-rose-50 text-rose-600 border-rose-100"
  };

  const nextStatus = payment.status === 'PAID' ? 'PENDING' : 'PAID';
  const invoiceNo = Array.isArray(payment.invoices) && payment.invoices.length > 0 
    ? payment.invoices[0].invoiceNo 
    : "N/A";

  return (
    <tr className="hover:bg-gray-50/50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
             <FileText size={14} />
          </div>
          <span className="text-sm font-bold text-gray-900">{invoiceNo}</span>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-gray-600">{payment.client?.name || "Unknown Client"}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-black text-gray-900">${Number(payment.amount).toLocaleString()}</span>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-bold text-gray-400 uppercase">
          {new Date(payment.year, payment.month-1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </span>
      </td>
      <td className="px-6 py-4">
        <form action={updatePaymentStatus.bind(null, payment.id, nextStatus)}>
          <button 
            type="submit" 
            aria-label={`Mark as ${nextStatus}`}
            className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest border transition-colors ${statusStyles[payment.status] || "bg-gray-50 text-gray-400 border-gray-100"}`}
          >
            {payment.status}
          </button>
        </form>
      </td>
      <td className="px-6 py-4 text-right">
        <button 
          className="text-gray-400 hover:text-indigo-600 transition-colors p-1"
          aria-label="View Invoice Details"
        >
          <ArrowRight size={18} />
        </button>
      </td>
    </tr>
  );
}
