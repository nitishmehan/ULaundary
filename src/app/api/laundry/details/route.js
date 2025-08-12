import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const laundryId = searchParams.get("id")

    if (!laundryId) {
      return NextResponse.json({ error: "Missing laundry ID" }, { status: 400 })
    }

    const laundry = await prisma.laundryProcess.findUnique({
      where: { id: laundryId },
      include: {
        student: {
          select: {
            name: true,
            hostelName: true,
            roomNumber: true,
            laundryNumber: true
          }
        }
      }
    })

    if (!laundry) {
      return NextResponse.json({ error: "Laundry not found" }, { status: 404 })
    }

    return NextResponse.json(laundry)
  } catch (error) {
    console.error("Fetch laundry details error:", error)
    return NextResponse.json({ error: "Failed to fetch laundry details" }, { status: 500 })
  }
}
