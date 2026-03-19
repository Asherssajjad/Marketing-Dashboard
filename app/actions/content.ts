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
  const planId = formData.get("planId") as string;
  const type = formData.get("type") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const notes = formData.get("notes") as string;

  await prisma.contentItem.create({
    data: {
      planId,
      type,
      status: "PUBLISHED", // Logging historical content
      scheduledDate: scheduledDate ? new Date(scheduledDate) : new Date(),
      notes
    }
  });

  revalidatePath("/content");
}
