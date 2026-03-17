"use server";

import prisma from "@/lib/prisma";

export async function getDashboardSummary() {
  const [
    clientCount,
    projectCount,
    overdueTasks,
    clients,
    latestTasks,
    latestProjects
  ] = await Promise.all([
    prisma.client.count({ where: { status: "ACTIVE" } }),
    prisma.project.count({ where: { NOT: { status: "LIVE" } } }),
    prisma.task.count({ 
      where: { 
        dueDate: { lt: new Date() },
        status: { not: "DONE" }
      } 
    }),
    prisma.client.findMany({
      include: { packages: true },
    }),
    prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: true }
    }),
    prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { client: true }
    })
  ]);

  const totalRevenue = clients.reduce((sum, c) => sum + (c.packages[0]?.price || 0), 0);

  return {
    clientCount,
    projectCount,
    overdueTasks,
    totalRevenue,
    latestTasks,
    latestProjects
  };
}
