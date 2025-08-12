"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AcceptRequestButton({ requestId, staffId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAccept = async () => {
    if (!confirm("Verify that all items in this laundry bag are correct?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/staff/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, staffId })
      })

      if (response.ok) {
        alert("Request accepted successfully!")
        router.refresh()
      } else {
        alert("Failed to accept request")
        setLoading(false)
      }
    } catch (error) {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAccept}
      disabled={loading}
      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 text-sm"
    >
      {loading ? "Processing..." : "Accept"}
    </button>
  )
}
