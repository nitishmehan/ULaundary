import { getCurrentUser } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import AcknowledgeButton from "@/components/AcknowledgeButton"
import { formatDate } from "@/lib/utils"

export default async function ActiveLaundryPage() {
  const user = await getCurrentUser()

  const activeLaundry = await prisma.laundryProcess.findMany({
    where: {
      studentId: user.id,
      status: { not: "DELIVERED" }
    },
    orderBy: { createdAt: "desc" }
  })

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
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">Active Laundry</h1>
        <p className="text-gray-400">Track your ongoing laundry requests</p>
      </div>

      <div className="space-y-6">
        {activeLaundry.length === 0 ? (
          <div className="glass-effect border border-white/10 rounded-2xl p-12 text-center">
            <p className="text-gray-400 text-lg mb-4">No active laundry requests</p>
            <a href={`/student/${user.id}/create-request`} className="inline-block bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white py-3 px-6 rounded-lg font-semibold">
              Create New Request
            </a>
          </div>
        ) : (
          activeLaundry.map((laundry) => (
            <div key={laundry.id} className="glass-effect border border-white/10 rounded-2xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    laundry.status === "GENERATED" ? "bg-blue-500/20 text-blue-300" :
                    laundry.status === "IN_PROCESS" ? "bg-yellow-500/20 text-yellow-300" :
                    "bg-purple-500/20 text-purple-300"
                  }`}>
                    {laundry.status.replace(/_/g, " ")}
                  </span>
                  <p className="text-gray-400 text-sm mt-2">
                    Created: {formatDate(laundry.createdAt)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Total Items</p>
                  <p className="text-3xl font-bold text-white">{laundry.totalItems}</p>
                </div>
              </div>

              <div className="overflow-x-auto mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium text-sm w-2/3">Item</th>
                      <th className="text-center py-3 px-4 text-gray-400 font-medium text-sm w-1/3">Quantity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clothingItems.map((item) => {
                      const qty = laundry[item.name]
                      if (qty === 0) return null
                      return (
                        <tr key={item.name} className="border-b border-white/5">
                          <td className="py-3 px-4 text-gray-300">{item.label}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block min-w-[40px] px-3 py-1 bg-white/10 rounded-lg text-white font-semibold">
                              {qty}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm mb-6">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Staff Verified</p>
                  <p className={`font-semibold ${laundry.staffAcknowledgedAt ? "text-green-400" : "text-yellow-400"}`}>
                    {laundry.staffAcknowledgedAt ? "✓ Completed" : "⏳ Pending"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Washing</p>
                  <p className={`font-semibold ${laundry.washingCompletedAt ? "text-green-400" : "text-yellow-400"}`}>
                    {laundry.washingCompletedAt ? "✓ Completed" : "⏳ Pending"}
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-gray-400 text-xs mb-1">Delivery</p>
                  <p className={`font-semibold ${laundry.status === "OUT_FOR_DELIVERY" ? "text-purple-400" : "text-gray-400"}`}>
                    {laundry.status === "OUT_FOR_DELIVERY" ? "🚚 On Way" : "⏳ Pending"}
                  </p>
                </div>
              </div>

              {laundry.status === "OUT_FOR_DELIVERY" && (
                <AcknowledgeButton laundryId={laundry.id} userId={user.id} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
