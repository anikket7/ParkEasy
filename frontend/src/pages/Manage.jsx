import { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Manage = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [spots, setSpots] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [viewingUser, setViewingUser] = useState(null);

  // Edit States
  const [editingSpot, setEditingSpot] = useState(null);
  const [editFormData, setEditFormData] = useState(null);
  const [activeModalTab, setActiveModalTab] = useState('active');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    fetchData();
  }, [isAdmin, navigate, activeTab]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [spotsRes, usersRes, bookingsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/parking', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/user/all', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/parking/bookings/all', {
          headers: { Authorization: `Bearer ${token}` }
        }).catch(() => ({ data: [] }))
      ]);

      setSpots(spotsRes.data);
      setUsers(usersRes.data || []);
      setBookings(bookingsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert(error.response?.data?.message || 'Error deleting user');
    }
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Are you sure you want to delete this parking spot?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/parking/${spotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
      alert('Parking spot deleted successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error deleting parking spot');
    }
  };


  const startEditSpot = (spot) => {
    setEditingSpot(spot._id);
    setEditFormData({
      name: spot.name || '',
      totalSpots: spot.totalSpots || 1,
      pricing: spot.pricing || {
        bike: { hourly: 0 },
        car: { hourly: 0 },
        bus: { hourly: 0 },
        truck: { hourly: 0 }
      }
    });
  };

  const handleUpdateSpot = async () => {
    try {
      const token = localStorage.getItem('token');

      const updateData = {
        name: editFormData.name,
        totalSpots: parseInt(editFormData.totalSpots),
        pricing: editFormData.pricing,
        pricePerHour: parseFloat(editFormData.pricing.car.hourly) || 0,
        pricePerDay: 0,
        pricePerMonth: 0
      };

      await axios.put(
        `http://localhost:5000/api/parking/${editingSpot}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEditingSpot(null);
      setEditFormData(null);
      fetchData();
      alert('Parking place updated successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating parking spot');
    }
  };

  const cancelEdit = () => {
    setEditingSpot(null);
    setEditFormData(null);
  };

  const updateEditPricing = (vehicleType, period, value) => {
    setEditFormData(prev => ({
      ...prev,
      pricing: {
        ...prev.pricing,
        [vehicleType]: {
          ...prev.pricing[vehicleType],
          [period]: value
        }
      }
    }));
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Admin Dashboard
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">Manage parking spots, bookings, and users</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-4xl font-bold">
                  ₹{bookings.reduce((sum, b) => {
                    // Only count revenue from non-cancelled bookings, or count all if that's the policy.
                    // Assuming cancelled bookings don't count towards revenue.
                    return b.status !== 'cancelled' ? sum + (b.totalAmount || 0) : sum;
                  }, 0).toFixed(2)}
                </p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                💰
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Total Bookings</p>
                <p className="text-4xl font-bold">{bookings.length}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
                📅
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'bookings'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Active Bookings ({bookings.filter(b => b.status === 'active').length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'history'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            Booking History
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'users'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            All Users ({users.filter(u => u.role !== 'admin').length})
          </button>
          <button
            onClick={() => setActiveTab('spots')}
            className={`px-6 py-3 font-semibold transition-all ${activeTab === 'spots'
              ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
          >
            All Spots ({spots.length})
          </button>
        </div>

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">Active Bookings</h2>
            {bookings.filter(b => b.status === 'active').length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No active bookings</p>
            ) : (
              <div className="grid gap-4">
                {bookings.filter(b => b.status === 'active').map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-2xl">
                          🅿️
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {booking.parkingSpotName || `Spot ${booking.parkingSpotId?.spotNumber}`}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{booking.location}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        {booking.status}
                      </span>
                    </div>

                    {/* Entry Code - Top Display */}
                    {booking.entryCode && (
                      <div className="mb-4 flex items-center justify-center">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 dark:from-purple-900/20 dark:via-purple-800/10 dark:to-indigo-900/20 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                              <span className="text-white text-sm">🔑</span>
                            </div>
                            <span className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider">Entry Code</span>
                          </div>
                          <div className="h-6 w-px bg-purple-300 dark:bg-purple-600"></div>
                          <span className="text-xl font-mono font-extrabold text-purple-900 dark:text-purple-100 tracking-[0.35em] bg-white dark:bg-gray-900 px-4 py-1.5 rounded-lg shadow-inner">
                            {booking.entryCode}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                      {/* Customer Details */}
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-right">
                            {booking.userId?.name || 'Unknown'}
                            {booking.userId?.email && <span className="block text-xs text-gray-500 font-normal">{booking.userId.email}</span>}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Booked On:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            }) : 'N/A'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {booking.bookedAt && booking.bookedUntil ?
                              `${((new Date(booking.bookedUntil) - new Date(booking.bookedAt)) / (1000 * 60 * 60)).toFixed(1)} hrs`
                              : 'N/A'}
                          </span>
                        </p>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valid From:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(booking.bookedAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valid Until:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(booking.bookedUntil).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Total Price:</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">All Booking History</h2>
            {bookings.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-400 text-center py-8">No booking history</p>
            ) : (
              <div className="grid gap-4">
                {bookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-2xl">
                          🅿️
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {booking.parkingSpotName || `Spot ${booking.parkingSpotId?.spotNumber}`}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[200px] truncate">{booking.location}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${booking.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                        booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                        }`}>
                        {booking.status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-sm border-t border-gray-100 dark:border-gray-700 pt-4">
                      {/* Customer Details */}
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Customer:</span>
                          <span className="font-semibold text-gray-900 dark:text-white text-right">
                            {booking.userId?.name || 'Unknown'}
                            {booking.userId?.email && <span className="block text-xs text-gray-500 font-normal">{booking.userId.email}</span>}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Booked On:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {booking.createdAt ? new Date(booking.createdAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            }) : 'N/A'}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Duration:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {booking.bookedAt && booking.bookedUntil ?
                              `${((new Date(booking.bookedUntil) - new Date(booking.bookedAt)) / (1000 * 60 * 60)).toFixed(1)} hrs`
                              : 'N/A'}
                          </span>
                        </p>
                      </div>

                      {/* Booking Details */}
                      <div className="space-y-2">
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valid From:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(booking.bookedAt).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Valid Until:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {new Date(booking.bookedUntil).toLocaleString('en-IN', {
                              day: '2-digit', month: 'short', year: 'numeric',
                              hour: '2-digit', minute: '2-digit', hour12: true
                            })}
                          </span>
                        </p>
                        <p className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
                          <span className="font-bold text-gray-700 dark:text-gray-300">Total Price:</span>
                          <span className="text-lg font-bold text-green-600 dark:text-green-400">
                            ₹{booking.totalAmount ? booking.totalAmount.toFixed(2) : '0.00'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
            <h2 className="text-2xl font-bold mb-6">All Users</h2>
            {(() => {
              const regularUsers = users.filter(u => u.role !== 'admin');

              if (regularUsers.length === 0) {
                return <p className="text-gray-600 dark:text-gray-400 text-center py-8">No users found</p>;
              }

              return (
                <>
                  <div className="grid gap-4">
                    {regularUsers.map((u) => (
                      <div
                        key={u._id || u.id}
                        className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{u.name}</h3>
                          <p className="text-gray-600 dark:text-gray-400">{u.email}</p>

                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              fetchData();
                              setViewingUser(u);
                            }}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
                          >
                            View Profile
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u._id || u.id)}
                            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* User Profile Modal */}
                  {viewingUser && ReactDOM.createPortal(
                    <div
                      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                      onClick={() => {
                        setViewingUser(null);
                        setActiveModalTab('active');
                      }}
                    >
                      <div
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full h-[80vh] flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                      >

                        {/* Header Section */}
                        <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                {viewingUser.name}
                                <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full capitalize">
                                  {viewingUser.role}
                                </span>
                              </h2>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">{viewingUser.email}</p>
                              <p className="text-xs text-gray-400 mt-1 font-mono">ID: {viewingUser.userId || 'N/A'}</p>
                            </div>
                            <button
                              onClick={() => {
                                setViewingUser(null);
                                setActiveModalTab('active');
                              }}
                              className="p-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full transition"
                            >
                              ✕
                            </button>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                              <p className="text-xs text-gray-500 uppercase font-bold">Total Spent</p>
                              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                                ₹{bookings.filter(b => (b.userId?._id || b.userId?.id || b.userId || '').toString() === (viewingUser._id || viewingUser.id || '').toString() && b.status === 'completed')
                                  .reduce((sum, b) => sum + (b.totalAmount || 0), 0).toFixed(2)}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                              <p className="text-xs text-gray-500 uppercase font-bold">Total Bookings</p>
                              <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                {bookings.filter(b => (b.userId?._id || b.userId?.id || b.userId || '').toString() === (viewingUser._id || viewingUser.id || '').toString()).length}
                              </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm text-center">
                              <p className="text-xs text-gray-500 uppercase font-bold">Active</p>
                              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                                {bookings.filter(b => (b.userId?._id || b.userId?.id || b.userId || '').toString() === (viewingUser._id || viewingUser.id || '').toString() && b.status === 'active').length}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Tabs */}
                        < div className="flex border-b border-gray-200 dark:border-gray-700" >
                          <button
                            onClick={() => setActiveModalTab('active')}
                            className={`flex-1 py-3 text-sm font-semibold transition relative ${activeModalTab === 'active'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                              }`}
                          >
                            Active Bookings
                            {activeModalTab === 'active' && (
                              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
                            )}
                          </button>
                          <button
                            onClick={() => setActiveModalTab('history')}
                            className={`flex-1 py-3 text-sm font-semibold transition relative ${activeModalTab === 'history'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                              }`}
                          >
                            History
                            {activeModalTab === 'history' && (
                              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 dark:bg-blue-400"></span>
                            )}
                          </button>
                        </div >

                        {/* Scrollable Content Area */}
                        < div className="p-6 overflow-y-auto flex-1 bg-gray-50/50 dark:bg-gray-900/30" >
                          {activeModalTab === 'active' ? (
                            <div className="space-y-3">
                              {(() => {
                                const activeBookings = bookings.filter(b => {
                                  const bookingUserId = (b.userId?._id || b.userId?.id || b.userId || '').toString();
                                  const currentUserId = (viewingUser._id || viewingUser.id || '').toString();
                                  return bookingUserId === currentUserId && b.status === 'active';
                                });

                                if (activeBookings.length === 0) return <div className="text-center py-10 text-gray-400 italic">No active bookings found</div>;

                                return activeBookings.map(booking => (
                                  <div key={booking._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-green-200 dark:border-green-900/50 shadow-sm">
                                    <div className="flex justify-between items-start">
                                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                        {booking.parkingSpotName || `Spot ${booking.parkingSpotId?.spotNumber}`}
                                      </h4>
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded uppercase">Active</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{booking.location}</p>

                                    {/* Entry Code - Top Display */}
                                    {booking.entryCode && (
                                      <div className="mb-3 flex items-center justify-center">
                                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-br from-purple-100 via-purple-50 to-indigo-100 dark:from-purple-900/20 dark:via-purple-800/10 dark:to-indigo-900/20 border-2 border-purple-300/50 dark:border-purple-600/50 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                                          <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 bg-gradient-to-br from-purple-600 to-indigo-600 dark:from-purple-500 dark:to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                                              <span className="text-white text-sm">🔑</span>
                                            </div>
                                            <span className="text-xs font-bold text-purple-800 dark:text-purple-200 uppercase tracking-wider">Entry Code</span>
                                          </div>
                                          <div className="h-6 w-px bg-purple-300 dark:bg-purple-600"></div>
                                          <span className="text-xl font-mono font-extrabold text-purple-900 dark:text-purple-100 tracking-[0.35em] bg-white dark:bg-gray-900 px-4 py-1.5 rounded-lg shadow-inner">
                                            {booking.entryCode}
                                          </span>
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                      <div>
                                        <p className="text-xs text-gray-400 uppercase">Valid From</p>
                                        <p className="font-semibold">{new Date(booking.bookedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase">Valid Until</p>
                                        <p className="font-semibold">{new Date(booking.bookedUntil).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {(() => {
                                const pastBookings = bookings.filter(b => {
                                  const bookingUserId = (b.userId?._id || b.userId?.id || b.userId || '').toString();
                                  const currentUserId = (viewingUser._id || viewingUser.id || '').toString();
                                  return bookingUserId === currentUserId && b.status !== 'active';
                                });

                                if (pastBookings.length === 0) return <div className="text-center py-10 text-gray-400 italic">No past booking history</div>;

                                return pastBookings.map(booking => (
                                  <div key={booking._id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                                    <div className="flex justify-between items-start mb-2">
                                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                                        {booking.parkingSpotName || `Spot ${booking.parkingSpotId?.spotNumber}`}
                                      </h4>
                                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${booking.status === 'completed' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                          'bg-gray-100 text-gray-700'
                                        }`}>
                                        {booking.status}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-3">{booking.location}</p>
                                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                                      <div>
                                        <p className="text-xs text-gray-400 uppercase">Valid From</p>
                                        <p className="font-semibold">{new Date(booking.bookedAt).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                      </div>
                                      <div className="text-right">
                                        <p className="text-xs text-gray-400 uppercase">Valid Until</p>
                                        <p className="font-semibold">{new Date(booking.bookedUntil).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                                      </div>
                                      <div className="col-span-2 flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-1">
                                        <p className="text-xs text-gray-400 uppercase">Total Price</p>
                                        <p className="font-bold text-gray-900 dark:text-white">₹{booking.totalAmount?.toFixed(2)}</p>
                                      </div>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          )
                          }
                        </div>
                      </div>
                    </div>,
                    document.body
                  )
                  }
                </>
              );
            })()}
          </div >
        )}

        {/* Spots Tab */}
        {
          activeTab === 'spots' && (
            <div className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-8 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl">
              <h2 className="text-2xl font-bold mb-6">All Parking Places</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {spots.map((spot) => {
                  const availableSpots = spot.availableSpots ?? (spot.isAvailable ? spot.totalSpots || 1 : 0);
                  const totalSpots = spot.totalSpots || 1;
                  const availabilityPercent = (availableSpots / totalSpots) * 100;

                  const getFeatureIcon = (feature) => {
                    const icons = {
                      'cctv': '📹',
                      'security': '🔒',
                      'lighting': '💡',
                      'covered': '🏠',
                      'ev_charging': '⚡',
                      'wheelchair_accessible': '♿',
                      'valet': '🚗',
                      'car_wash': '🧼',
                      '24/7': '🕐'
                    };
                    return icons[feature] || '✓';
                  };

                  const getFeatureLabel = (feature) => {
                    const labels = {
                      'cctv': 'CCTV',
                      'security': 'Security',
                      'lighting': 'Lighting',
                      'covered': 'Covered',
                      'ev_charging': 'EV Charging',
                      'wheelchair_accessible': 'Wheelchair',
                      'valet': 'Valet',
                      'car_wash': 'Car Wash',
                      '24/7': '24/7'
                    };
                    return labels[feature] || feature;
                  };

                  return (
                    <div
                      key={spot._id}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                            {spot.name || `Spot ${spot.spotNumber}`}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{spot.location}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500">ID: {spot.spotNumber}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${availableSpots > 0
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                          }`}>
                          {availableSpots > 0 ? 'Available' : 'Full'}
                        </span>
                      </div>

                      {/* Capacity */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Capacity</span>
                          <span className={`font-semibold ${availableSpots > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {availableSpots} / {totalSpots} spots
                          </span>
                        </div>
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${availableSpots > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                            style={{ width: `${availabilityPercent}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Pricing */}
                      {spot.pricing && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Pricing (₹/hr):</p>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            {Object.entries(spot.pricing).map(([vehicle, prices]) => (
                              prices.hourly > 0 && (
                                <div key={vehicle} className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                                  <p className="font-semibold capitalize text-gray-800 dark:text-gray-200">{vehicle}</p>
                                  <p className="text-blue-600 dark:text-blue-400">₹{prices.hourly}</p>
                                </div>
                              )
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Features */}
                      {spot.features && spot.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Features:</p>
                          <div className="flex flex-wrap gap-1">
                            {spot.features.slice(0, 4).map(feature => (
                              <span key={feature} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                                {getFeatureIcon(feature)} {getFeatureLabel(feature)}
                              </span>
                            ))}
                            {spot.features.length > 4 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded text-xs">
                                +{spot.features.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditSpot(spot)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition transform hover:scale-105 shadow-md"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteSpot(spot._id)}
                          className="flex-1 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold transition transform hover:scale-105 shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        }

        {/* Edit Modal */}
        {
          editingSpot && editFormData && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-8">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Edit Parking Place
                    </h2>
                    <button
                      onClick={cancelEdit}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Form */}
                  <div className="space-y-6">
                    {/* Name and Capacity */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Parking Place Name</label>
                        <input
                          type="text"
                          value={editFormData.name}
                          onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Total Parking Spots</label>
                        <input
                          type="number"
                          min="1"
                          value={editFormData.totalSpots}
                          onChange={(e) => setEditFormData({ ...editFormData, totalSpots: e.target.value })}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Pricing (₹)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {['bike', 'car', 'bus', 'truck'].map(vehicleType => (
                          <div key={vehicleType} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
                            <h4 className="font-semibold mb-2 capitalize">{vehicleType}</h4>
                            <div className="space-y-2">
                              <div>
                                <label className="text-xs text-gray-600 dark:text-gray-400">Hourly (₹)</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  value={editFormData.pricing[vehicleType].hourly}
                                  onChange={(e) => updateEditPricing(vehicleType, 'hourly', e.target.value)}
                                  className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-black dark:text-white"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpdateSpot}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      </div >
    </div >
  );
};

export default Manage;

