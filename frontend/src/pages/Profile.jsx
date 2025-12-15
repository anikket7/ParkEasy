import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
      fetchBookingHistory();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/parking', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Filter bookings for current user
      const userBookings = response.data.filter(
        spot => spot.bookedBy && (spot.bookedBy._id === user._id || spot.bookedBy._id === user.id)
      );
      setBookings(userBookings);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/parking/history/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookingHistory(response.data);
    } catch (error) {
      console.error('Error fetching booking history:', error);
    }
  };

  // Separate active and completed bookings from history
  // Use history records for active bookings too, as they contain the correct snapshot data (price, vehicle type, etc)
  const activeBookings = bookingHistory.filter(h => h.status === 'active');
  const completedBookings = bookingHistory.filter(h =>
    h.status === 'completed' || h.status === 'cancelled' || h.status === 'released'
  );

  const handleBookingAction = async (spotId, action) => {
    const confirmMessage = action === 'cancelled'
      ? 'Are you sure you want to cancel this booking?'
      : 'Are you sure you want to release this parking spot?';

    if (!window.confirm(confirmMessage)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/parking/${spotId}/release`,
        { status: action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
      fetchBookingHistory();
      alert('Booking cancelled successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error cancelling booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              My Profile
            </span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your account and view your bookings</p>
        </div>

        {/* User Info Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl flex items-center justify-center text-white font-bold text-4xl shadow-lg">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">{user?.email}</p>

              {/* User Info Grid */}
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl text-sm font-semibold">
                  {user?.role === 'admin' ? 'Admin' : '👤 User'}
                </span>
                {user?.userId && (
                  <span className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-xl text-sm font-semibold">
                    🆔 ID: {user.userId}
                  </span>
                )}
                <span className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl text-sm font-semibold">
                  ✅ Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Bookings */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Active Bookings</p>
                <p className="text-4xl font-bold">{activeBookings.length}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                📋
              </div>
            </div>
          </div>

          {/* Active Spots */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Active Spots</p>
                <p className="text-4xl font-bold">
                  {activeBookings.reduce((sum, spot) => sum + (spot.bookedSpots || 1), 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                🅿️
              </div>
            </div>
          </div>

          {/* Total Spending */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Active Spending</p>
                <p className="text-4xl font-bold">
                  ₹{activeBookings.reduce((sum, spot) => sum + ((spot.pricePerHour || 0) * (spot.bookedSpots || 1)), 0)}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                💰
              </div>
            </div>
          </div>
        </div>

        {/* My Bookings Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Active Bookings</h2>
            </div>
            {activeBookings.length > 0 && (
              <span className="px-5 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400 rounded-xl text-lg font-bold shadow-md">
                {activeBookings.length} Active
              </span>
            )}
          </div>

          {activeBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">You don't have any bookings yet</p>
              <a
                href="/parking"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                Book a Parking Spot
              </a>
            </div>
          ) : (
            <div className="grid gap-6">
              {activeBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
                    {/* Left Section - Booking Details */}
                    <div className="flex-1">
                      {/* Header with badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {booking.parkingSpotName}
                        </h3>
                        <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                          ACTIVE
                        </span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid md:grid-cols-2 gap-3">
                        {/* Location */}
                        <div className="flex items-start gap-2">
                          <span className="text-blue-500 text-lg mt-0.5">📍</span>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{booking.location}</p>
                          </div>
                        </div>

                        {/* Spots Booked */}
                        <div className="flex items-start gap-2">
                          <span className="text-purple-500 text-lg mt-0.5">🅿️</span>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Spots Booked</p>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">{booking.bookedSpots || 1} Parking Spot{(booking.bookedSpots || 1) > 1 ? 's' : ''}</p>
                          </div>
                        </div>

                        {/* Total Price */}
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 text-lg mt-0.5">💰</span>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Price</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">₹{booking.totalAmount}</p>
                          </div>
                        </div>

                        {/* Booked Time */}
                        {booking.bookedAt && (
                          <div className="flex items-start gap-2">
                            <span className="text-orange-500 text-lg mt-0.5">🕐</span>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Booked On</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Valid Until */}
                        {booking.bookedUntil && (
                          <div className="flex items-start gap-2 md:col-span-2">
                            <span className="text-red-500 text-lg mt-0.5">⏰</span>
                            <div>
                              <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Valid Until</p>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {new Date(booking.bookedUntil).toLocaleDateString('en-IN', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right Section - Action Buttons */}
                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => {
                          const spotId = booking.parkingSpotId?._id || booking.parkingSpotId;
                          if (!spotId) {
                            console.error('Missing spot ID for booking:', booking);
                            alert('Error: Cannot identify parking spot. Please contact support.');
                            return;
                          }
                          handleBookingAction(spotId, 'released');
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                      >
                        Release Spot
                      </button>
                      <button
                        onClick={() => {
                          const spotId = booking.parkingSpotId?._id || booking.parkingSpotId;
                          if (!spotId) {
                            console.error('Missing spot ID for booking:', booking);
                            alert('Error: Cannot identify parking spot. Please contact support.');
                            return;
                          }
                          handleBookingAction(spotId, 'cancelled');
                        }}
                        className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking History Section */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Booking History</h2>
            </div>
            {completedBookings.length > 0 && (
              <span className="px-5 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-lg font-bold shadow-md">
                {completedBookings.length} Completed
              </span>
            )}
          </div>

          {completedBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">No booking history yet</p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Your completed bookings will appear here</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {completedBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 p-5 rounded-xl border border-gray-300 dark:border-gray-700 opacity-75"
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300">
                          {booking.parkingSpotName}
                        </h3>
                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${booking.status === 'cancelled'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          : booking.status === 'released'
                            ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          }`}>
                          {booking.status === 'cancelled' ? '❌ Cancelled' : booking.status === 'released' ? '🔵 Released' : '✅ Completed'}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">📍 {booking.location}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        🕐 {new Date(booking.bookedAt).toLocaleString()} - {new Date(booking.bookedUntil).toLocaleString()}
                      </p>
                      {booking.releasedAt && (
                        <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">
                          Released: {new Date(booking.releasedAt).toLocaleString()}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">₹{booking.totalAmount}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.bookedSpots} spot(s)</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">₹{booking.pricePerHour}/hr</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

