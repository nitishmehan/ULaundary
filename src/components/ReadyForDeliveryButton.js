"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReadyForDeliveryButton({ requestId, staffId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleReady = async () => {
    if (!confirm("Mark this laundry as ready for delivery?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/staff/ready-for-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, staffId })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to update status")
        setLoading(false)
      }
    } catch (error) {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleReady}
      disabled={loading}
      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-sm"
    >
      {loading ? "Processing..." : "Ready"}
    </button>
  )
}
