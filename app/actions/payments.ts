"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function getPayments() {
  // Admin only for payments
  try {
    await requireAdmin();

    return await prisma.payment.findMany({
      select: {
        id: true,
        amount: true,
        month: true,
        year: true,
        status: true,
        client: {
          select: { id: true, name: true }
        },
        invoices: {
          select: { invoiceNo: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("[GET_PAYMENTS_ERROR]", error);
    return [];
  }
}

export async function createPayment(formData: FormData) {
  try {
    await requireAdmin();

    const clientId = formData.get("clientId") as string;
    const amount = parseFloat(formData.get("amount") as string);
    const month = parseInt(formData.get("month") as string);
    const year = parseInt(formData.get("year") as string);

    // Strict Validation
    if (!clientId) throw new Error("Client is required.");
    if (isNaN(amount) || amount <= 0 || amount > 1000000) throw new Error("Invalid amount.");
    if (isNaN(month) || month < 1 || month > 12) throw new Error("Invalid month.");
    if (isNaN(year) || year < 2000 || year > 2100) throw new Error("Invalid year.");

    const payment = await prisma.payment.create({
      data: { clientId, amount, month, year, status: "PENDING" }
    });

    const invoiceNo = `INV-${year}${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
    await prisma.invoice.create({
      data: { paymentId: payment.id, invoiceNo }
    });

    revalidatePath("/payments");
    return { success: true };
  } catch (error: any) {
    console.error("[CREATE_PAYMENT_ERROR]", error);
    return { success: false, error: "Failed to generate invoice." };
  }
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  try {
    await requireAdmin();
    
    if (!["PAID", "PENDING", "OVERDUE"].includes(status)) throw new Error("Invalid status");

    await prisma.payment.update({
      where: { id: paymentId },
      data: { 
        status,
        paidOn: status === "PAID" ? new Date() : null
      }
    });
    revalidatePath("/payments");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_PAYMENT_ERROR]", error);
    return { success: false, error: "Status update failed." };
  }
}
