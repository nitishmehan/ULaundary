"use client"

import { useState } from "react"
import { formatDate } from "@/lib/utils"

export default function PendingDeliveriesList({ deliveries }) {
  const [viewingDelivery, setViewingDelivery] = useState(null)

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

  if (viewingDelivery) {
    return (
      <div className="mt-6">
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => setViewingDelivery(null)}
            className="flex items-center gap-2 text-gray-400 hover:text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to List
          </button>
          <h3 className="text-2xl font-bold text-white">Delivery Slip</h3>
          <div className="w-24"></div>
        </div>

        <div className="space-y-6">
          {/* Student Info */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <h4 className="text-lg font-semibold text-white mb-4">Delivery Information</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Student Name</p>
                <p className="text-white font-medium">{viewingDelivery.student.name}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Hostel</p>
                <p className="text-white font-medium">{viewingDelivery.student.hostelName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Room Number</p>
                <p className="text-white font-medium">{viewingDelivery.student.roomNumber}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Laundry #</p>
                <p className="text-white font-medium">{viewingDelivery.student.laundryNumber}</p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold text-white">Items to Deliver</h4>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Total Items</p>
                <p className="text-2xl font-bold text-cyan-400">{viewingDelivery.totalItems}</p>
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
                    const qty = viewingDelivery[item.name]
                    if (qty === 0) return null
                    return (
                      <tr key={item.name} className="border-b border-white/5">
                        <td className="py-3 px-4 text-gray-300">{item.label}</td>
                        <td className="py-3 px-4 text-center">
                          <span className="inline-block min-w-[40px] px-3 py-1 bg-green-500/20 text-green-300 rounded-lg font-semibold">
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

          <button
            onClick={() => setViewingDelivery(null)}
            className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg font-semibold"
          >
            Close
          </button>
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
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Floor</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Items</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Ready Since</th>
            <th className="text-center py-4 px-4 text-gray-400 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {deliveries.length === 0 ? (
            <tr>
              <td colSpan={7} className="py-12 text-center text-gray-400">
                No pending deliveries found
              </td>
            </tr>
          ) : (
            deliveries.map((delivery) => (
              <tr key={delivery.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 text-white font-medium">{delivery.student.name}</td>
                <td className="py-4 px-4 text-gray-300">{delivery.student.hostelName}</td>
                <td className="py-4 px-4 text-center text-gray-300">{delivery.student.roomNumber}</td>
                <td className="py-4 px-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded-full font-semibold">
                    {delivery.student.roomNumber.charAt(0)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center text-white font-semibold">{delivery.totalItems}</td>
                <td className="py-4 px-4 text-center text-gray-400 text-sm">
                  {formatDate(delivery.outForDeliveryAt)}
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => setViewingDelivery(delivery)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
                  >
                    View Slip
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
