"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateRequestForm({ userId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

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

  const [quantities, setQuantities] = useState(
    clothingItems.reduce((acc, item) => ({ ...acc, [item.name]: 0 }), {})
  )

  const handleQuantityChange = (name, value) => {
    const numValue = parseInt(value) || 0
    setQuantities(prev => ({ 
      ...prev, 
      [name]: Math.max(0, Math.min(numValue, 99)) // Limit to 0-99
    }))
  }

  const totalItems = Object.values(quantities).reduce((sum, qty) => sum + qty, 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (totalItems === 0) {
      setError("Please add at least one item")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/student/create-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          ...quantities,
          totalItems
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create request")
        setLoading(false)
        return
      }

      router.push(`/student/${userId}/active`)
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-effect border border-white/10 rounded-2xl p-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">Select Items</h2>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Total Items</p>
          <p className="text-3xl font-bold text-cyan-400">{totalItems}</p>
        </div>
      </div>

      <div className="overflow-x-auto mb-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-4 px-4 text-gray-400 font-medium w-1/2">Item</th>
              <th className="text-center py-4 px-4 text-gray-400 font-medium w-1/2">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {clothingItems.map((item) => (
              <tr key={item.name} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-4 px-4 text-white">{item.label}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.name, quantities[item.name] - 1)}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={quantities[item.name]}
                      onChange={(e) => handleQuantityChange(item.name, e.target.value)}
                      className="w-24 text-center px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(item.name, quantities[item.name] + 1)}
                      className="w-10 h-10 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || totalItems === 0}
          className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Submit Request"}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/student/${userId}`)}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
