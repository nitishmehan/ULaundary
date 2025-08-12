"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ReportIssueForm({ userId, activeLaundry }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    laundryProcessId: "",
    description: ""
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.laundryProcessId || !formData.description.trim()) {
      setError("Please fill all fields")
      return
    }

    if (formData.description.trim().length < 10) {
      setError("Please provide a detailed description (minimum 10 characters)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/student/report-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to report issue")
        setLoading(false)
        return
      }

      router.push(`/student/${userId}`)
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  if (activeLaundry.length === 0) {
    return (
      <div className="glass-effect border border-white/10 rounded-2xl p-12 text-center">
        <p className="text-gray-400 text-lg mb-4">No active laundry to report issues for</p>
        <a href={`/student/${userId}/create-request`} className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold">
          Create New Request
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="glass-effect border border-white/10 rounded-2xl p-8 h-full">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-6 h-full flex flex-col">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Laundry Request
          </label>
          <select
            value={formData.laundryProcessId}
            onChange={(e) => setFormData({ ...formData, laundryProcessId: e.target.value })}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" className="bg-zinc-900">Select a laundry request</option>
            {activeLaundry.map((laundry) => (
              <option key={laundry.id} value={laundry.id} className="bg-zinc-900">
                {laundry.status.replace(/_/g, " ")} - {new Date(laundry.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Describe the Issue
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="flex-1 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            placeholder="Please describe the problem in detail..."
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Report Issue"}
          </button>
          <button
            type="button"
            onClick={() => router.push(`/student/${userId}`)}
            className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  )
}
