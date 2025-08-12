"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyUserButton({ userId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleVerify = async () => {
    if (!confirm("Are you sure you want to verify this user?")) return

    setLoading(true)
    try {
      const response = await fetch("/api/admin/verify-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      })

      if (response.ok) {
        router.refresh()
      } else {
        alert("Failed to verify user")
      }
    } catch (error) {
      alert("Error verifying user")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleVerify}
      disabled={loading}
      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-all"
    >
      {loading ? "Verifying..." : "Verify"}
    </button>
  )
}
