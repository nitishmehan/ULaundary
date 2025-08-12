import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "DELIVERY_PERSON") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { deliveryId, userId } = body

    if (user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.laundryProcess.update({
      where: { id: deliveryId },
      data: {
        deliveryPerson: {
          connect: { id: userId }
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Assign delivery error:", error)
    return NextResponse.json({ error: "Failed to assign delivery" }, { status: 500 })
  }
}
