"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getContentTrackers() {
  // Fetch clients with their active packages and monthly plans
  return prisma.client.findMany({
    include: {
      packages: {
        include: {
          monthlyPlans: {
            include: {
              contentItems: {
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
}

export async function getClientContent(clientId: string) {
  return prisma.client.findUnique({
    where: { id: clientId },
    include: {
      packages: {
        include: {
          monthlyPlans: {
            include: {
              contentItems: {
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
}

export async function markContentAsPublished(itemId: string) {
  try {
    await prisma.contentItem.update({
      where: { id: itemId },
      data: { status: "PUBLISHED" }
    });
    revalidatePath("/content");
  } catch (error) {
    console.error("Failed to update content status:", error);
  }
}

export async function createMonthlyPlan(packageId: string, month: number, year: number) {
  try {
    const plan = await prisma.monthlyPlan.create({
      data: {
        packageId,
        month,
        year,
      }
    });

    revalidatePath("/content");
    return plan;
  } catch (error) {
    console.error("Failed to create monthly plan:", error);
    return { error: "Failed to create monthly plan" };
  }
}

export async function addContentItem(planId: string, data: { type: string, notes?: string, assignedTo?: string }) {
  try {
    const item = await prisma.contentItem.create({
      data: {
        planId,
        type: data.type,
        notes: data.notes,
        assignedTo: data.assignedTo,
        status: "PLANNED"
      }
    });

    revalidatePath("/content");
    return item;
  } catch (error) {
    console.error("Failed to add content item:", error);
    return { error: "Failed to add content item" };
  }
}
export async function createContentLog(formData: FormData) {
  let planId = formData.get("planId") as string;
  const type = formData.get("type") as string;
  const scheduledDateStr = formData.get("scheduledDate") as string;
  const notes = formData.get("notes") as string;
  const clientId = formData.get("clientId") as string;

  // If planId is missing, we need to find or create one for the current month
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

  if (!planId) {
    console.error("Cannot create content log: Missing Plan ID and no client package found.");
    return;
  }

  await prisma.contentItem.create({
    data: {
      planId,
      type,
      status: "PUBLISHED",
      scheduledDate: scheduledDateStr ? new Date(scheduledDateStr) : new Date(),
      notes
    }
  });

  revalidatePath("/content");
  revalidatePath(`/content/${clientId}`);
}
