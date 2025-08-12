"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AcknowledgeButton({ laundryId, userId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAcknowledge = async () => {
    if (!confirm("Have you received your laundry and verified all items are correct?")) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/student/acknowledge-delivery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ laundryId, userId })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to acknowledge delivery")
        setLoading(false)
      }
    } catch (error) {
      alert("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleAcknowledge}
      disabled={loading}
      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {loading ? (
        "Processing..."
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Acknowledge Receipt - Mark as Delivered
        </>
      )}
    </button>
  )
}
