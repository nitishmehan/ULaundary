"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export default function DeliverySearchFilter({ hostels, currentSearch, currentHostel, currentFloor, currentFromDate, currentToDate }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(currentSearch || "")
  const [hostel, setHostel] = useState(currentHostel || "")
  const [floor, setFloor] = useState(currentFloor || "")
  const [fromDate, setFromDate] = useState(currentFromDate || "")
  const [toDate, setToDate] = useState(currentToDate || "")

  const handleFilter = (e) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams)
    
    if (search) params.set("search", search)
    else params.delete("search")
    
    if (hostel) params.set("hostel", hostel)
    else params.delete("hostel")
    
    if (floor) params.set("floor", floor)
    else params.delete("floor")

    if (fromDate) params.set("fromDate", fromDate)
    else params.delete("fromDate")

    if (toDate) params.set("toDate", toDate)
    else params.delete("toDate")
    
    router.push(`?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setHostel("")
    setFloor("")
    setFromDate("")
    setToDate("")
    router.push(window.location.pathname)
  }

  return (
    <form onSubmit={handleFilter} className="space-y-4">
      <div className="grid md:grid-cols-4 gap-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or room..."
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        
        <select
          value={hostel}
          onChange={(e) => setHostel(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="" className="bg-zinc-900">All Hostels</option>
          {hostels.map((h) => (
            <option key={h} value={h} className="bg-zinc-900">{h}</option>
          ))}
        </select>

        <select
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <option value="" className="bg-zinc-900">All Floors</option>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <option key={num} value={num} className="bg-zinc-900">Floor {num}</option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-3 rounded-lg font-semibold"
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

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">From Date</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">To Date</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </form>
  )
}
