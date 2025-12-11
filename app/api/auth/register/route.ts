import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body as {
      name?: string;
      email?: string;
      password?: string;
    };

    // Basic validation
    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json(
        { error: "Invalid input." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with that email already exists." },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ⚠️ Your Prisma User model MUST have `password String` for this
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { success: true, userId: user.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[REGISTER_API_ERROR]", err);

    const message =
      (err && err.message) ||
      (typeof err === "string" ? err : "Unknown server error");

    // DEBUG: send real message back to the client so we can see it
    return NextResponse.json(
      { error: "DEBUG: " + message },
      { status: 500 }
    );
  }
}
