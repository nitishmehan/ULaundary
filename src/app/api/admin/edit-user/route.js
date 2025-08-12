import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(request) {
  try {
    const user = await getCurrentUser()

    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { userId, name, email, hostelName, roomNumber, laundryNumber } = body

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser && existingUser.id !== userId) {
      return NextResponse.json({ error: "Email already in use" }, { status: 400 })
    }

    const updateData = {
      name,
      email,
      ...(hostelName && { hostelName }),
      ...(roomNumber && { roomNumber }),
      ...(laundryNumber && { laundryNumber: parseInt(laundryNumber) })
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Edit user error:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
