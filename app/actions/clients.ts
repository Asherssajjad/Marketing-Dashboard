"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

export async function createClient(formData: FormData) {
  try {
    await requireAdmin();
    
    const name = (formData.get("name") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();
    const platforms = formData.getAll("platforms") as string[];
    const pkgName = formData.get("package") as string;

    if (!name || !pkgName) return { error: "Name and Package are required" };

    const client = await prisma.client.create({
      data: {
        name,
        contact,
        platforms,
        packages: {
          create: {
            name: pkgName,
            reels_pm: parseInt(formData.get("reels_pm") as string) || 0,
            posts_pm: parseInt(formData.get("posts_pm") as string) || 0,
            price: parseFloat(formData.get("price") as string) || 0,
          }
        }
      }
    });

    revalidatePath("/clients");
    revalidatePath("/content");
    revalidatePath("/");
  } catch (error: any) {
    console.error("Failed to create client:", error);
    return { error: error.message || "Failed to create client" };
  }

  redirect("/clients");
}

export async function getClients() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    return await prisma.client.findMany({
      select: {
        id: true,
        name: true,
        contact: true,
        platforms: true,
        status: true,
        createdAt: true,
        packages: {
          select: { name: true, price: true, reels_pm: true, posts_pm: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("GET_CLIENTS_ERROR", error);
    return [];
  }
}

export async function updateClient(clientId: string, formData: FormData) {
  try {
    await requireAdmin();
    
    const name = (formData.get("name") as string)?.trim();
    const contact = (formData.get("contact") as string)?.trim();
    const platforms = formData.getAll("platforms") as string[];
    const status = formData.get("status") as string;
    const pkgName = formData.get("package") as string;

    if (!name || !pkgName) return { error: "Name and Package are required" };

    // Find if package already exists
    const existingPackage = await prisma.package.findFirst({
      where: { clientId }
    });

    await prisma.$transaction([
      prisma.client.update({
        where: { id: clientId },
        data: {
          name,
          contact,
          platforms,
          status: status as any
        }
      }),
      existingPackage
        ? prisma.package.update({
            where: { id: existingPackage.id },
            data: {
              name: pkgName,
              price: parseFloat(formData.get("price") as string) || 0,
              reels_pm: parseInt(formData.get("reels_pm") as string) || 0,
              posts_pm: parseInt(formData.get("posts_pm") as string) || 0,
            }
          })
        : prisma.package.create({
            data: {
              name: pkgName,
              clientId,
              price: parseFloat(formData.get("price") as string) || 0,
              reels_pm: parseInt(formData.get("reels_pm") as string) || 0,
              posts_pm: parseInt(formData.get("posts_pm") as string) || 0,
            }
          })
    ]);

    revalidatePath("/clients");
    revalidatePath("/content");
    revalidatePath("/");
  } catch (error: any) {
    console.error("Failed to update client:", error);
    return { error: error.message || "Failed to update client" };
  }

  redirect("/clients");
}

export async function deleteClient(clientId: string) {
  try {
    await requireAdmin();

    // 1. Get package IDs
    const packages = await prisma.package.findMany({
      where: { clientId },
      select: { id: true }
    });
    const packageIds = packages.map(p => p.id);

    // 2. Get monthly plans for these packages
    const monthlyPlans = await prisma.monthlyPlan.findMany({
      where: { packageId: { in: packageIds } },
      select: { id: true }
    });
    const monthlyPlanIds = monthlyPlans.map(mp => mp.id);

    // 3. Get payments for this client
    const payments = await prisma.payment.findMany({
      where: { clientId },
      select: { id: true }
    });
    const paymentIds = payments.map(p => p.id);

    // Clean up relation references safely inside a transaction block
    await prisma.$transaction([
      // Delete Content Items
      prisma.contentItem.deleteMany({
        where: { planId: { in: monthlyPlanIds } }
      }),
      // Delete Monthly Plans
      prisma.monthlyPlan.deleteMany({
        where: { packageId: { in: packageIds } }
      }),
      // Delete Packages
      prisma.package.deleteMany({
        where: { clientId }
      }),
      // Delete Tasks
      prisma.task.deleteMany({
        where: { clientId }
      }),
      // Delete Projects
      prisma.project.deleteMany({
        where: { clientId }
      }),
      // Delete Invoices
      prisma.invoice.deleteMany({
        where: { paymentId: { in: paymentIds } }
      }),
      // Delete Payments
      prisma.payment.deleteMany({
        where: { clientId }
      }),
      // Delete Client
      prisma.client.delete({
        where: { id: clientId }
      })
    ]);

    revalidatePath("/clients");
    revalidatePath("/content");
    revalidatePath("/payments");
    revalidatePath("/");
  } catch (error: any) {
    console.error("Failed to delete client:", error);
    return { error: error.message || "Failed to delete client" };
  }

  redirect("/clients");
}
