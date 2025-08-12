"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/lib/utils"

export default function PendingRequestsList({ requests, staffId }) {
  const router = useRouter()
  const [viewingRequest, setViewingRequest] = useState(null)
  const [loading, setLoading] = useState(false)

  const clothingItems = [
    { name: "bedSheetQty", label: "Bed Sheet" },
    { name: "pillowCoverQty", label: "Pillow Cover" },
    { name: "towelQty", label: "Towel" },
    { name: "salwarQty", label: "Salwar" },
    { name: "kurtaQty", label: "Kurta" },
    { name: "lowerPyjamaQty", label: "Lower/Pyjama" },
    { name: "jacketQty", label: "Jacket" },
    { name: "nikkarQty", label: "Nikkar" },
    { name: "jeansQty", label: "Jeans" },
    { name: "tShirtQty", label: "T-Shirt" },
    { name: "universityShirtQty", label: "University Shirt" },
    { name: "universityPantQty", label: "University Pant" },
    { name: "civilPantQty", label: "Civil Pant" },
    { name: "civilShirtQty", label: "Civil Shirt" },
    { name: "schoolSweaterQty", label: "School Sweater" },
    { name: "schoolCoatQty", label: "School Coat" },
    { name: "skirtQty", label: "Skirt" },
    { name: "dupattaQty", label: "Dupatta" },
    { name: "turbanQty", label: "Turban" },
    { name: "apronQty", label: "Apron" },
    { name: "whiteCoatQty", label: "White Coat" },
    { name: "upperHoodieQty", label: "Upper/Hoodie" },
    { name: "smallBlanketQty", label: "Small Blanket" },
    { name: "bigBlanketQty", label: "Big Blanket" }
  ]

  const handleAccept = async (requestId) => {
    if (!confirm("Verify that all items in this laundry bag are correct?")) return

    setLoading(true)
    try {
      const response = await fetch("/api/staff/accept-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, staffId })
      })

      if (response.ok) {
        router.refresh()
        setViewingRequest(null)
      } else {
        alert("Failed to accept request")
      }
    } catch (error) {
      alert("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (viewingRequest) {
    return (
      <div className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setViewingRequest(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
          <h3 className="text-2xl font-bold text-white">Laundry Details</h3>
          <div className="w-24"></div>
        </div>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-4">Student Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Name</p>
                <p className="text-white font-medium">{viewingRequest.student.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hostel</p>
                <p className="text-white font-medium">{viewingRequest.student.hostelName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Room</p>
                <p className="text-white font-medium">{viewingRequest.student.roomNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Laundry #</p>
                <p className="text-white font-medium">{viewingRequest.student.laundryNumber}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white">Items List</h4>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-cyan-400">{viewingRequest.totalItems}</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Item</th>
                    <th className="text-center py-3 px-4 text-gray-400 font-medium">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {clothingItems.map((item) => {
                    const qty = viewingRequest[item.name]
                    if (qty === 0) return null
                    return (
                      <tr key={item.name} className="border-b border-white/5">
                        <td className="py-3 px-4 text-gray-300">{item.label}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block min-w-[40px] px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg font-semibold">
                            {qty}
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => handleAccept(viewingRequest.id)}
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Processing..." : "Accept & Verify"}
            </button>
            <button
              onClick={() => setViewingRequest(null)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Student</th>
            <th className="text-left py-4 px-4 text-gray-400 font-medium">Hostel</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Room</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Laundry #</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Items</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Created</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {requests.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-gray-400">
                No pending requests found
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr key={request.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 text-white font-medium">{request.student.name}</td>
                <td className="py-4 px-4 text-gray-300">{request.student.hostelName}</td>
                <td className="py-4 px-4 text-center text-gray-300">{request.student.roomNumber}</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-semibold">
                    {request.student.laundryNumber}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-white font-semibold">{request.totalItems}</td>
                <td className="py-4 px-4 text-center text-gray-400 text-sm">
                  {formatDate(request.createdAt)}
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => setViewingRequest(request)}
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  >
                    View & Accept
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
