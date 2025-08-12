import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "LAUNDRY_STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, staffId } = body

    if (user.id !== staffId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const laundry = await prisma.laundryProcess.findUnique({
      where: { id: requestId }
    })

    if (!laundry || laundry.status !== "IN_PROCESS") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }

    await prisma.laundryProcess.update({
      where: { id: requestId },
      data: {
        status: "OUT_FOR_DELIVERY",
        washingCompleted: true,
        washingCompletedAt: new Date()
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Ready for delivery error:", error)
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 })
  }
}
