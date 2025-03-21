import { NextResponse } from "next/server";
import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: "Discount code is required" },
        { status: 400 },
      );
    }

    // Find the discount code in the database
    const discountCode = await prisma.discountCode.findFirst({
      where: {
        code: code,
        stock: { gt: 0 },
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });

    if (!discountCode) {
      return NextResponse.json(
        { error: "Invalid or expired discount code" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: discountCode.id,
        code: discountCode.code,
        percent: discountCode.percent,
        maxDiscountAmount: discountCode.maxDiscountAmount,
      },
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    return NextResponse.json(
      { error: "Failed to validate discount code" },
      { status: 500 },
    );
  }
}
