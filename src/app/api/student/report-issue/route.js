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
    const { userId, laundryProcessId, description } = body

    if (user.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const problem = await prisma.problem.create({
      data: {
        laundryProcessId,
        reportedById: userId,
        description
      }
    })

    return NextResponse.json({ success: true, id: problem.id })
  } catch (error) {
    console.error("Report issue error:", error)
    return NextResponse.json({ error: "Failed to report issue" }, { status: 500 })
  }
}
