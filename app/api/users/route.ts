import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET all users (Admin only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("[USERS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// POST create user (Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role } = body;

    // 1. Basic Validation
    if (!email || !password || !name) {
      return new NextResponse("Name, Email and Password are required", { status: 400 });
    }

    // 2. Role Validation (Prevent privilege escalation)
    const validRoles = ["ADMIN", "MANAGER", "TEAM_MEMBER"];
    if (!validRoles.includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // 3. Normalize Email
    const normalizedEmail = email.toLowerCase().trim();

    // 4. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create User
    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      }
    });

    return NextResponse.json(user);
  } catch (error: any) {
    console.error("[USERS_POST]", error);

    // Handle Duplicate Email (Prisma P2002)
    if (error.code === 'P2002') {
      return new NextResponse("User with this email already exists", { status: 409 });
    }

    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
