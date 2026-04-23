"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

async function requireAuth() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("Unauthorized");
  return session;
}

export async function getContentTrackers() {
  try {
    await requireAuth();
    return prisma.client.findMany({
      include: {
        packages: {
          include: {
            monthlyPlans: {
              include: {
                contentItems: {
                  include: { lastUpdatedBy: { select: { name: true } } },
                  orderBy: { createdAt: 'desc' }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });
  } catch (error) {
    return [];
  }
}

export async function getClientContent(clientId: string) {
  try {
    await requireAuth();
    return prisma.client.findUnique({
      where: { id: clientId },
      include: {
        packages: {
          include: {
            monthlyPlans: {
              include: {
                contentItems: {
                  include: { lastUpdatedBy: { select: { name: true } } },
                  orderBy: { scheduledDate: 'asc' }
                }
              },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });
  } catch (error) {
    return null;
  }
}

export async function updateContentItem(itemId: string, data: { status?: string, notes?: string, scheduledDate?: string }) {
  try {
    const session = await requireAuth();
    
    await prisma.contentItem.update({
      where: { id: itemId },
      data: { 
        status: data.status,
        notes: data.notes,
        scheduledDate: data.scheduledDate ? new Date(data.scheduledDate) : undefined,
        updatedById: session.user.id
      }
    });

    revalidatePath("/content");
    return { success: true };
  } catch (error) {
    console.error("Failed to update content item:", error);
    return { success: false };
  }
}

export async function deleteContentItem(itemId: string) {
  try {
    const session = await requireAuth();
    if (session.user.role !== 'ADMIN') throw new Error("Forbidden");

    await prisma.contentItem.delete({ where: { id: itemId } });
    revalidatePath("/content");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function createContentLog(formData: FormData) {
  try {
    const session = await requireAuth();
    
    let planId = formData.get("planId") as string;
    const type = formData.get("type") as string;
    const status = formData.get("status") as string || "PUBLISHED";
    const scheduledDateStr = formData.get("scheduledDate") as string;
    const notes = formData.get("notes") as string;
    const clientId = formData.get("clientId") as string;

    if (!planId && clientId) {
      const client = await prisma.client.findUnique({
        where: { id: clientId },
        include: { packages: true }
      });

      const pkg = client?.packages[0];
      if (pkg) {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        let plan = await prisma.monthlyPlan.findFirst({
          where: { packageId: pkg.id, month, year }
        });

        if (!plan) {
          plan = await prisma.monthlyPlan.create({
            data: { packageId: pkg.id, month, year }
          });
        }
        planId = plan.id;
      }
    }

    if (!planId) return { error: "No plan found" };

    await prisma.contentItem.create({
      data: {
        planId,
        type,
        status,
        scheduledDate: scheduledDateStr ? new Date(scheduledDateStr) : new Date(),
        notes,
        updatedById: session.user.id
      }
    });

    revalidatePath("/content");
    revalidatePath(`/content/${clientId}`);
    return { success: true };
  } catch (error) {
    console.error("CREATE_CONTENT_LOG_ERROR", error);
    return { success: false };
  }
}
