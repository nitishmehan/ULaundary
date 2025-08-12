"use client"

import { useState } from "react"
import Link from "next/link"

export default function SignupPage() {
  const [selectedRole, setSelectedRole] = useState(null)

  const roles = [
    {
      id: "STUDENT",
      title: "Student",
      description: "Access laundry services",
      icon: "🎓",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      id: "LAUNDRY_STAFF",
      title: "Laundry Staff",
      description: "Process laundry requests",
      icon: "👔",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      id: "DELIVERY_PERSON",
      title: "Delivery Person",
      description: "Deliver laundry",
      icon: "🚚",
      gradient: "from-green-500 to-emerald-500"
    }
  ]

  if (selectedRole) {
    return <SignupForm role={selectedRole} onBack={() => setSelectedRole(null)} />
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Diagonal gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-600 to-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
              Get Started
            </span>
          </h1>
          <p className="text-gray-400 text-lg">Choose your role to create an account</p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {roles.map((role) => (
            <button
              key={role.id}
              onClick={() => setSelectedRole(role.id)}
              className="group glass-effect border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all duration-300 text-left relative overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <div className="relative">
                <div className="text-5xl mb-4">{role.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-2">{role.title}</h3>
                <p className="text-gray-400 mb-6">{role.description}</p>
                
                <div className={`inline-flex items-center text-transparent bg-gradient-to-r ${role.gradient} bg-clip-text font-semibold`}>
                  Continue
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

function SignupForm({ role, onBack }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: role,
    hostelName: "",
    roomNumber: "",
    laundryNumber: 1
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Something went wrong")
        setLoading(false)
        return
      }

      window.location.href = "/login?registered=true"
    } catch (error) {
      setError("Something went wrong")
      setLoading(false)
    }
  }

  const hostels = [
    "Archimedes", "Megallen", "Franklin", "Aristotle",
    "Marco Polo", "Armstrong", "Vasco", "Columbus"
  ]

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Diagonal gradient circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-600 to-blue-400 rounded-full filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="glass-effect border border-white/10 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
          
          <div className="relative">
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-2">
                <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Create Account
                </span>
              </h2>
              <p className="text-gray-400 text-sm">
                {role === "STUDENT" && "Student Registration"}
                {role === "LAUNDRY_STAFF" && "Staff Registration"}
                {role === "DELIVERY_PERSON" && "Delivery Person Registration"}
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 text-red-300 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="you@university.edu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  placeholder="Minimum 6 characters"
                />
              </div>

              {role === "STUDENT" && (
                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Hostel</label>
                    <select
                      required
                      value={formData.hostelName}
                      onChange={(e) => setFormData({ ...formData, hostelName: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      <option value="" className="bg-zinc-900">Select hostel</option>
                      {hostels.map((hostel) => (
                        <option key={hostel} value={hostel} className="bg-zinc-900">{hostel}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Room Number</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      placeholder="e.g., 204"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Laundry Number</label>
                    <select
                      value={formData.laundryNumber}
                      onChange={(e) => setFormData({ ...formData, laundryNumber: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    >
                      {[1, 2, 3, 4].map(num => (
                        <option key={num} value={num} className="bg-zinc-900">{num}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 via-cyan-500 to-purple-500 hover:from-blue-600 hover:via-cyan-600 hover:to-purple-600 text-white font-semibold py-3.5 px-4 rounded-xl disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all mt-6"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 p-4 glass-effect border border-blue-500/20 rounded-2xl">
          <p className="text-sm text-cyan-300 text-center">
            ℹ️ Admin will verify your account before you can login
          </p>
        </div>
      </div>
    </div>
  )
}
