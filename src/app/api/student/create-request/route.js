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
    const { userId, totalItems, ...quantities } = body

    if (user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if student already has an active request
    const activeRequest = await prisma.laundryProcess.findFirst({
      where: {
        studentId: userId,
        status: { not: "DELIVERED" }
      }
    })

    if (activeRequest) {
      return NextResponse.json({ 
        error: "You already have an active laundry request. Please wait until it's delivered before creating a new one." 
      }, { status: 400 })
    }

    const laundryProcess = await prisma.laundryProcess.create({
      data: {
        studentId: userId,
        totalItems,
        ...quantities
      }
    })

    return NextResponse.json({ success: true, id: laundryProcess.id })
  } catch (error) {
    console.error("Create request error:", error)
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 })
  }
}
