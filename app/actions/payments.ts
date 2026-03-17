"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  return prisma.payment.findMany({
    include: {
      client: true,
      invoices: true
    },
    orderBy: { year: 'desc' }
  });
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  try {
    await prisma.payment.update({
      where: { id: paymentId },
      data: { 
        status,
        paidOn: status === "PAID" ? new Date() : null
      }
    });
    revalidatePath("/payments");
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to update payment status:", error);
  }
}

export async function createInvoice(paymentId: string) {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { client: true }
    });

    if (!payment) throw new Error("Payment not found");

    const invoiceNo = `AXN-${payment.year}-${Math.floor(1000 + Math.random() * 9000)}`;

    await prisma.invoice.create({
      data: {
        paymentId,
        invoiceNo,
        pdfUrl: `https://storage.axion.com/invoices/${invoiceNo}.pdf` // Mock URL
      }
    });

    revalidatePath("/payments");
  } catch (error) {
    console.error("Failed to create invoice:", error);
  }
}
