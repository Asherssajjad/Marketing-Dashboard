import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Use a singleton record with id 'singleton'
    let settings = await prisma.agencySettings.findUnique({
      where: { id: "singleton" }
    });

    if (!settings) {
      settings = await prisma.agencySettings.create({
        data: { id: "singleton" }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { agencyName, supportEmail, primaryColor, logoUrl } = body;

    const settings = await prisma.agencySettings.upsert({
      where: { id: "singleton" },
      update: {
        agencyName,
        supportEmail,
        primaryColor,
        logoUrl
      },
      create: {
        id: "singleton",
        agencyName,
        supportEmail,
        primaryColor,
        logoUrl
      }
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
