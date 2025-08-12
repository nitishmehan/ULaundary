import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { laundryId, userId } = body

    if (user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify the laundry belongs to the student
    const laundry = await prisma.laundryProcess.findUnique({
      where: { id: laundryId }
    })

    if (!laundry || laundry.studentId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (laundry.status !== "OUT_FOR_DELIVERY") {
      return NextResponse.json({ error: "Laundry not ready for delivery" }, { status: 400 })
    }

    await prisma.laundryProcess.update({
      where: { id: laundryId },
      data: {
        status: "DELIVERED",
        studentReceived: true,
        deliveredAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Acknowledge delivery error:", error)
    return NextResponse.json({ error: "Failed to acknowledge delivery" }, { status: 500 })
  }
}
