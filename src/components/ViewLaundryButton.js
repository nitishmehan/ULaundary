"use client"

import { useState, useEffect } from "react"

export default function ViewLaundryButton({ laundryId }) {
  const [showModal, setShowModal] = useState(false)
  const [laundryData, setLaundryData] = useState(null)
  const [loading, setLoading] = useState(false)

  const fetchLaundryDetails = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/laundry/details?id=${laundryId}`)
      const data = await response.json()
      setLaundryData(data)
    } catch (error) {
      console.error("Failed to fetch laundry details")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (showModal) {
      fetchLaundryDetails()
    }
  }, [showModal])

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

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold text-sm"
      >
        View
      </button>

      {showModal && (
        <div 
          className="fixed top-0 left-0 right-0 bottom-0 bg-black/50 backdrop-blur-sm z-[9999]"
          onClick={() => setShowModal(false)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-3xl">
            <div 
              className="glass-effect border border-white/10 rounded-2xl max-h-[80vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center p-6 border-b border-white/10 flex-shrink-0">
                <h2 className="text-2xl font-bold text-white">Laundry Items</h2>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-400">Loading...</p>
                  </div>
                ) : laundryData ? (
                  <>
                    {/* Student Info */}
                    <div className="mb-6 p-4 bg-white/5 rounded-lg">
                      <h3 className="text-lg font-semibold text-white mb-3">Student Information</h3>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <p className="text-gray-400">Name</p>
                          <p className="text-white font-medium">{laundryData.student.name}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Hostel</p>
                          <p className="text-white font-medium">{laundryData.student.hostelName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Room</p>
                          <p className="text-white font-medium">{laundryData.student.roomNumber}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Laundry #</p>
                          <p className="text-white font-medium">{laundryData.student.laundryNumber}</p>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Items List</h3>
                        <div className="text-right">
                          <p className="text-gray-400 text-sm">Total Items</p>
                          <p className="text-2xl font-bold text-cyan-400">{laundryData.totalItems}</p>
                        </div>
                      </div>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b border-white/10">
                              <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm">Item</th>
                              <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm">Quantity</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clothingItems.map((item) => {
                              const qty = laundryData[item.name]
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

                    {/* Request Info */}
                    <div className="p-4 bg-white/5 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-400">Status</p>
                          <span className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-semibold mt-1">
                            {laundryData.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">Created</p>
                          <p className="text-white mt-1">{new Date(laundryData.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-center text-gray-400 py-12">Failed to load laundry details</p>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-white/10 flex-shrink-0">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-lg font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
