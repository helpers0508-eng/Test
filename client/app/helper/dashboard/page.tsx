'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, Clock, DollarSign, CheckCircle, User, LogOut } from 'lucide-react'

interface Booking {
  id: number
  bookingId: string
  date: string
  time: string
  status: string
  price: number
  address: string
  notes: string
  user: {
    name: string
    phone: string
  }
  service: {
    name: string
  }
}

interface HelperStats {
  totalBookings: number
  completedBookings: number
  totalEarnings: number
  pendingBookings: number
}

export default function HelperDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<HelperStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/admin/login'
        return
      }

      // Load assigned bookings
      const bookingsResponse = await fetch('/api/bookings/helper', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (bookingsResponse.ok) {
        const bookingsData = await bookingsResponse.json()
        setBookings(bookingsData.bookings)

        // Calculate stats
        const totalBookings = bookingsData.bookings.length
        const completedBookings = bookingsData.bookings.filter((b: Booking) => b.status === 'completed').length
        const totalEarnings = bookingsData.bookings
          .filter((b: Booking) => b.status === 'completed')
          .reduce((sum: number, b: Booking) => sum + b.price, 0)
        const pendingBookings = bookingsData.bookings.filter((b: Booking) =>
          ['confirmed', 'in_progress'].includes(b.status)
        ).length

        setStats({
          totalBookings,
          completedBookings,
          totalEarnings,
          pendingBookings
        })
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        // Reload data
        loadDashboardData()
        alert(`Booking ${newStatus === 'completed' ? 'completed' : 'cancelled'} successfully!`)
      } else {
        alert('Failed to update booking status')
      }
    } catch (error) {
      console.error('Failed to update booking:', error)
      alert('Failed to update booking status')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/login'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      {/* Header */}
      <header className="bg-white dark:bg-background-dark shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <div className="size-8 text-primary">
                <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.8261 30.5736C16.7203 29.8826 20.2244 29.4783 24 29.4783C27.7756 29.4783 31.2797 29.8826 34.1739 30.5736C36.9144 31.2278 39.9967 32.7669 41.3563 33.8352L24.8486 7.36089C24.4571 6.73303 23.5429 6.73303 23.1514 7.36089L6.64374 33.8352C8.00331 32.7669 11.0856 31.2278 13.8261 30.5736Z" fill="currentColor"></path>
                  <path clipRule="evenodd" d="M39.998 35.764C39.9944 35.7463 39.9875 35.7155 39.9748 35.6706C39.9436 35.5601 39.8949 35.4259 39.8346 35.2825C39.8168 35.2403 39.7989 35.1993 39.7813 35.1602C38.5103 34.2887 35.9788 33.0607 33.7095 32.5189C30.9875 31.8691 27.6413 31.4783 24 31.4783C20.3587 31.4783 17.0125 31.8691 14.2905 32.5189C12.0012 33.0654 9.44505 34.3104 8.18538 35.1832C8.17384 35.2075 8.16216 35.233 8.15052 35.2592C8.09919 35.3751 8.05721 35.4886 8.02977 35.589C8.00356 35.6848 8.00039 35.7333 8.00004 35.7388C8.00004 35.739 8 35.7393 8.00004 35.7388C8.00004 35.7641 8.0104 36.0767 8.68485 36.6314C9.34546 37.1746 10.4222 37.7531 11.9291 38.2772C14.9242 39.319 19.1919 40 24 40C28.8081 40 33.0758 39.319 36.0709 38.2772C37.5778 37.7531 38.6545 37.1746 39.3151 36.6314C39.9006 36.1499 39.9857 35.8511 39.998 35.764ZM4.95178 32.7688L21.4543 6.30267C22.6288 4.4191 25.3712 4.41909 26.5457 6.30267L43.0534 32.777C43.0709 32.8052 43.0878 32.8338 43.104 32.8629L41.3563 33.8352C43.104 32.8629 43.1038 32.8626 43.104 32.8629L43.1051 32.865L43.1065 32.8675L43.1101 32.8739L43.1199 32.8918C43.1276 32.906 43.1377 32.9246 43.1497 32.9473C43.1738 32.9925 43.2062 33.0545 43.244 33.1299C43.319 33.2792 43.4196 33.489 43.5217 33.7317C43.6901 34.1321 44 34.9311 44 35.7391C44 37.4427 43.003 38.7775 41.8558 39.7209C40.6947 40.6757 39.1354 41.4464 37.385 42.0552C33.8654 43.2794 29.133 44 24 44C18.867 44 14.1346 43.2794 10.615 42.0552C8.86463 41.4464 7.30529 40.6757 6.14419 39.7209C4.99695 38.7775 3.99999 37.4427 3.99999 35.7391C3.99999 34.8725 4.29264 34.0922 4.49321 33.6393C4.60375 33.3898 4.71348 33.1804 4.79687 33.0311C4.83898 32.9556 4.87547 32.8935 4.9035 32.8471C4.91754 32.8238 4.92954 32.8043 4.93916 32.7889L4.94662 32.777L4.95178 32.7688ZM35.9868 29.004L24 9.77997L12.0131 29.004C12.4661 28.8609 12.9179 28.7342 13.3617 28.6282C16.4281 27.8961 20.0901 27.4783 24 27.4783C27.9099 27.4783 31.5719 27.8961 34.6383 28.6282C35.082 28.7342 35.5339 28.8609 35.9868 29.004Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Helper Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Welcome, Helper
              </span>
              <Link href="/helper/profile" className="p-2 text-gray-500 hover:text-primary rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completedBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                  <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingBookings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">${stats.totalEarnings}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings */}
        <div className="bg-white dark:bg-background-dark rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">My Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 mb-4">No bookings assigned yet</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                You'll receive notifications when new bookings are assigned to you.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">{booking.service.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Booking #{booking.bookingId}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      booking.status === 'completed' ? 'text-green-600 bg-green-100' :
                      booking.status === 'confirmed' ? 'text-blue-600 bg-blue-100' :
                      booking.status === 'in_progress' ? 'text-yellow-600 bg-yellow-100' :
                      'text-red-600 bg-red-100'
                    }`}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Clock className="h-4 w-4" />
                      <span>{booking.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <User className="h-4 w-4" />
                      <span>{booking.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <span className="font-medium">${booking.price}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <strong>Notes:</strong> {booking.notes}
                      </p>
                    </div>
                  )}

                  {booking.address && (
                    <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <strong>Address:</strong> {booking.address}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {booking.status === 'confirmed' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'in_progress')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Start Service
                      </button>
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        className="px-4 py-2 border border-red-300 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {booking.status === 'in_progress' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'completed')}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Mark Complete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}