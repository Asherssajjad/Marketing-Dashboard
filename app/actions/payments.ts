"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPayments() {
  return prisma.payment.findMany({
    include: {
      client: true,
      invoices: true
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function createPayment(formData: FormData) {
  const clientId = formData.get("clientId") as string;
  const amount = parseFloat(formData.get("amount") as string);
  const month = parseInt(formData.get("month") as string);
  const year = parseInt(formData.get("year") as string);

  const payment = await prisma.payment.create({
    data: {
      clientId,
      amount,
      month,
      year,
      status: "PENDING"
    }
  });

  // Automatically generate an invoice record
  const invoiceNo = `INV-${year}${month.toString().padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;
  await prisma.invoice.create({
    data: {
      paymentId: payment.id,
      invoiceNo,
    }
  });

  revalidatePath("/payments");
  return payment;
}

export async function updatePaymentStatus(paymentId: string, status: string) {
  await prisma.payment.update({
    where: { id: paymentId },
    data: { 
      status,
      paidOn: status === "PAID" ? new Date() : null
    }
  });
  revalidatePath("/payments");
}
