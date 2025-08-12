"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function AdminUserSearchFilter({ userType, hostels, currentSearch, currentHostel, currentLaundryNumber }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || "")
  const [hostel, setHostel] = useState(currentHostel || "")
  const [laundryNumber, setLaundryNumber] = useState(currentLaundryNumber || "")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    
    if (search) params.set("search", search)
    else params.delete("search")
    
    if (userType === "student") {
      if (hostel) params.set("hostel", hostel)
      else params.delete("hostel")
      
      if (laundryNumber) params.set("laundryNumber", laundryNumber)
      else params.delete("laundryNumber")
    }
    
    router.push(`?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setHostel("")
    setLaundryNumber("")
    router.push(window.location.pathname)
  }

  return (
    <form onSubmit={handleFilter} className="space-y-4">
      <div className={`grid ${userType === "student" ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {userType === "student" && (
          <>
            <select
              value={hostel}
              onChange={(e) => setHostel(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-zinc-900">All Hostels</option>
              {hostels?.map((h) => (
                <option key={h} value={h} className="bg-zinc-900">{h}</option>
              ))}
            </select>

            <select
              value={laundryNumber}
              onChange={(e) => setLaundryNumber(e.target.value)}
              className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="bg-zinc-900">All Laundry #</option>
              {[1, 2, 3, 4].map((num) => (
                <option key={num} value={num} className="bg-zinc-900">{num}</option>
              ))}
            </select>
          </>
        )}

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-3 rounded-lg font-semibold"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg"
          >
            Reset
          </button>
        </div>
      </div>
    </form>
  )
}
