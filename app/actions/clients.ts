"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const name = formData.get("name") as string;
  const contact = formData.get("contact") as string;
  const platforms = formData.getAll("platforms") as string[];
  const pkgName = formData.get("package") as string;

  if (!name || !pkgName) return { error: "Name and Package are required" };

  try {
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
  } catch (error) {
    console.error("Failed to create client:", error);
    return { error: "Failed to create client wrapper" }
  }

  redirect("/clients");
}

export async function getClients() {
  return prisma.client.findMany({
    include: {
      packages: true,
      tasks: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}
