import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId } = await request.json()

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Verify user error:", error)
    return NextResponse.json({ error: "Failed to verify user" }, { status: 500 })
  }
}
