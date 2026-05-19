import { Topbar } from "@/components/Topbar";
import { DollarSign, CheckCircle2, AlertTriangle, FileText, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { getPayments, updatePaymentStatus } from "@/app/actions/payments";
import { getClients } from "@/app/actions/clients";
import NewInvoiceModal from "./NewInvoiceModal";
import Link from "next/link";

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

interface PaymentsPageProps {
  searchParams: {
    month?: string;
    year?: string;
  };
}

export default async function PaymentsPage({ searchParams }: PaymentsPageProps) {
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

  // Parse selected month & year (defaulting to current date if not defined)
  const now = new Date();
  const currentMonth = searchParams.month ? parseInt(searchParams.month) : (now.getMonth() + 1); // 1-12
  const currentYear = searchParams.year ? parseInt(searchParams.year) : now.getFullYear();

  // Helper for Decimal arithmetic
  const getAmount = (p: any) => Number(p.amount) || 0;

  // Global receivables tracking
  const totalPending = payments
    .filter(p => p.status === 'PENDING')
    .reduce((sum, p) => sum + getAmount(p), 0);
    
  const overdueAmount = payments
    .filter(p => p.status === 'OVERDUE')
    .reduce((sum, p) => sum + getAmount(p), 0);

  // Period specific billing calculations (MTD)
  const collectedMTD = payments
    .filter(p => p.status === 'PAID' && p.month === currentMonth && p.year === currentYear)
    .reduce((sum, p) => sum + getAmount(p), 0);

  const pendingMTD = payments
    .filter(p => p.status === 'PENDING' && p.month === currentMonth && p.year === currentYear)
    .reduce((sum, p) => sum + getAmount(p), 0);

  const projectedMTD = collectedMTD + pendingMTD;

  // Filter list of payments to only show invoices belonging to the selected month & year
  const monthlyPayments = payments.filter(
    p => p.month === currentMonth && p.year === currentYear
  );

  // Month navigation logic
  let prevMonth = currentMonth - 1;
  let prevYear = currentYear;
  if (prevMonth < 1) {
    prevMonth = 12;
    prevYear -= 1;
  }

  let nextMonth = currentMonth + 1;
  let nextYear = currentYear;
  if (nextMonth > 12) {
    nextMonth = 1;
    nextYear += 1;
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const currentMonthName = monthNames[currentMonth - 1];

  return (
    <>
      <Topbar title="Financials & Invoicing" breadcrumb="Payments" />

      <div className="flex-1 overflow-auto p-4 md:p-8 bg-gray-50/30">
        <div className="max-w-[1280px] mx-auto space-y-8">
          
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex items-center gap-3">
              <AlertTriangle size={20} />
              {error}
            </div>
          )}

          {/* Period Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Billing Period — {currentMonthName} {currentYear}
              </h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1">Reviewing invoice entries and receivables</p>
            </div>
            <div className="flex items-center gap-2">
              <Link 
                href={`/payments?month=${prevMonth}&year=${prevYear}`}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ChevronLeft size={16} /> Prev Month
              </Link>
              <Link 
                href={`/payments?month=${nextMonth}&year=${nextYear}`}
                className="px-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold text-gray-500 hover:text-indigo-600 hover:border-indigo-100 flex items-center gap-1.5 transition-all shadow-sm"
              >
                Next Month <ChevronRight size={16} />
              </Link>
            </div>
          </div>

          {/* Financial Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FinancialStat label="GLOBAL PENDING" value={`Rs. ${totalPending.toLocaleString()}`} icon={<Clock size={18}/>} color="text-amber-600" bgColor="bg-amber-50" />
            <FinancialStat label={`COLLECTED (${currentMonthName.slice(0,3).toUpperCase()})`} value={`Rs. ${collectedMTD.toLocaleString()}`} icon={<CheckCircle2 size={18}/>} color="text-emerald-600" bgColor="bg-emerald-50" />
            <FinancialStat label="GLOBAL OVERDUE" value={`Rs. ${overdueAmount.toLocaleString()}`} icon={<AlertTriangle size={18}/>} color="text-rose-600" bgColor="bg-rose-50" />
            <FinancialStat label={`PROJECTED (${currentMonthName.slice(0,3).toUpperCase()})`} value={`Rs. ${projectedMTD.toLocaleString()}`} icon={<DollarSign size={18}/>} color="text-indigo-600" bgColor="bg-indigo-50" />
          </div>

          {/* Invoices List Table */}
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider">Invoices for {currentMonthName} {currentYear}</h3>
              <NewInvoiceModal clients={clients} />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Invoice #</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Client</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Period</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black tracking-widest text-gray-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {monthlyPayments.length === 0 ? (
                    <tr>
                       <td colSpan={6} className="px-6 py-16 text-center text-gray-400 italic font-medium">
                         No financial entries recorded for {currentMonthName} {currentYear}.
                       </td>
                    </tr>
                  ) : (
                    monthlyPayments.map((p) => (
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
        <span className="text-sm font-black text-gray-900">Rs. {Number(payment.amount).toLocaleString()}</span>
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
