"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  return prisma.task.findMany({
    include: {
      client: true,
      project: true,
      assignee: true,
      comments: true,
    },
    orderBy: { dueDate: 'asc' }
  });
}

export async function createTask(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string || "TODO";
  const dueDateStr = formData.get("dueDate") as string;
  
  const dueDate = dueDateStr ? new Date(dueDateStr) : undefined;

  if (!title) return { error: "Title is required" };

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        status,
        dueDate,
      }
    });

    revalidatePath("/tasks");
  } catch (error) {
    console.error("Failed to create task:", error);
    return { error: "Failed to create task wrapper" }
  }
}

export async function updateTaskStatus(taskId: string, newStatus: string) {
  try {
    await prisma.task.update({
      where: { id: taskId },
      data: { status: newStatus }
    });
    revalidatePath("/tasks");
  } catch (error) {
    console.error("Failed to update status:", error);
  }
}
