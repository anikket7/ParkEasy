import { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../context/AuthContext';

const ParkingSpots = () => {
  const { user, isAdmin } = useAuth();
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBookForm, setShowBookForm] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    spotNumber: '',
    location: '',
    totalSpots: '',
    availableSpots: '',
    pricing: {
      bike: { hourly: '', daily: '', monthly: '' },
      car: { hourly: '', daily: '', monthly: '' },
      bus: { hourly: '', daily: '', monthly: '' },
      truck: { hourly: '', daily: '', monthly: '' }
    },
    features: [],
    vehicleType: 'Any'
  });

  // Booking State
  const [bookingStart, setBookingStart] = useState('');
  const [bookingEnd, setBookingEnd] = useState('');
  const [bookingCost, setBookingCost] = useState(0);
  const [spotsToBook, setSpotsToBook] = useState(1);

  const [selectedVehicleType, setSelectedVehicleType] = useState('car');

  // Search States
  const [searchQuery, setSearchQuery] = useState('');

  // Edit States
  const [editingSpot, setEditingSpot] = useState(null);
  const [editFormData, setEditFormData] = useState(null);

  // View Details State
  const [viewingSpot, setViewingSpot] = useState(null);

  // Booking State
  const [bookingSpot, setBookingSpot] = useState(null);

  useEffect(() => {
    fetchSpots();

    // Auto-refresh when page becomes visible (e.g., switching tabs or coming back from another page)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchSpots();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Calculate cost whenever times or vehicle type change
  useEffect(() => {
    if (bookingSpot && bookingStart && bookingEnd) {
      const start = new Date(bookingStart);
      const end = new Date(bookingEnd);

      if (start < end) {
        const durationMs = end - start;
        const durationHours = durationMs / (1000 * 60 * 60);

        let hourlyRate = bookingSpot.pricePerHour || 0;
        if (bookingSpot.pricing && bookingSpot.pricing[selectedVehicleType] && bookingSpot.pricing[selectedVehicleType].hourly) {
          hourlyRate = bookingSpot.pricing[selectedVehicleType].hourly;
        }

        setBookingCost(Math.max(0, durationHours * hourlyRate * spotsToBook));
      } else {
        setBookingCost(0);
      }
    }
  }, [bookingStart, bookingEnd, selectedVehicleType, bookingSpot, spotsToBook]);

  const fetchSpots = async () => {
    try {
      setError(null);
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/parking');
      setSpots(response.data || []);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      setError(
        error.response?.data?.message ||
        error.message ||
        'Failed to fetch parking spots. Make sure the backend server is running on port 5000.'
      );
      setSpots([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSpot = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      // Clean and prepare pricing data (only hourly)
      const cleanPricing = {
        bike: { hourly: parseFloat(formData.pricing.bike.hourly) || 0 },
        car: { hourly: parseFloat(formData.pricing.car.hourly) || 0 },
        bus: { hourly: parseFloat(formData.pricing.bus.hourly) || 0 },
        truck: { hourly: parseFloat(formData.pricing.truck.hourly) || 0 }
      };

      // Prepare data with proper structure
      // Prepare data with proper structure
      const spotData = {
        name: formData.name,
        spotNumber: 'P-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 1000), // Auto-generate unique ID
        location: formData.location,
        totalSpots: parseInt(formData.totalSpots) || 1,
        availableSpots: parseInt(formData.totalSpots) || 1,
        pricing: cleanPricing,
        features: formData.features || [],
        vehicleType: formData.vehicleType,
        pricePerHour: cleanPricing.car.hourly,
        pricePerDay: 0,
        pricePerMonth: 0
      };

      await axios.post('http://localhost:5000/api/parking', spotData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Reset form
      setFormData({
        name: '',
        spotNumber: '',
        location: '',
        totalSpots: '',
        availableSpots: '',
        pricing: {
          bike: { hourly: '' },
          car: { hourly: '' },
          bus: { hourly: '' },
          truck: { hourly: '' }
        },
        features: [],
        vehicleType: 'Any'
      });
      setShowAddForm(false);
      fetchSpots();
      alert('Parking place added successfully!');
    } catch (error) {
      console.error('Error adding parking spot:', error);
      alert(error.response?.data?.message || error.message || 'Error adding parking spot');
    }
  };

  const handleBookSpot = async (e) => {
    e.preventDefault();
    if (!bookingSpot) return;

    try {
      const token = localStorage.getItem('token');
      const payload = {
        startTime: bookingStart,
        endTime: bookingEnd,
        spotsToBook: spotsToBook,
        vehicleType: selectedVehicleType
      };

      const response = await axios.post(
        `http://localhost:5000/api/parking/${bookingSpot._id}/book`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookingSpot(null);
      setBookingStart('');
      setBookingEnd('');
      setSpotsToBook(1);
      setSelectedVehicleType('car');
      fetchSpots();

      // Show entry code in the success message
      const entryCode = response.data.entryCode;
      const totalCost = response.data.totalAmount ? response.data.totalAmount.toFixed(2) : bookingCost.toFixed(2);
      alert(`✅ Parking spot booked successfully!\n\n🔑 ENTRY CODE: ${entryCode}\n💰 Total Cost: ₹${totalCost}\n\nPlease save this code to enter the parking spot.`);
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking parking spot');
    }
  };

  const handleReleaseSpot = async (spotId) => {
    if (!window.confirm('Are you sure you want to release this parking spot?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/parking/${spotId}/release`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSpots();
      alert('Parking spot released successfully!');
    } catch (error) {
      alert(error.response?.data?.message || 'Error releasing parking spot');
    }
  };

  const handleDeleteSpot = async (spotId) => {
    if (!window.confirm('Are you sure you want to delete this parking spot?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/parking/${spotId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchSpots();
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
      fetchSpots();
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

  const toggleFeature = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const updatePricing = (vehicleType, period, value) => {
    setFormData(prev => ({
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
      'wheelchair_accessible': 'Wheelchair Accessible',
      'valet': 'Valet Service',
      'car_wash': 'Car Wash',
      '24/7': '24/7 Access'
    };
    return labels[feature] || feature;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex items-center justify-center transition-colors">
        <div className="text-xl">Loading parking spots...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Error Loading Parking Spots</h2>
            <p className="mb-4">{error}</p>
            <button
              onClick={fetchSpots}
              className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
                🅿️ Available Parking Places
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Parking Places
              </span>
            </h1>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              {showAddForm ? 'Cancel' : '+ Add Parking Place'}
            </button>
          )}
        </div>

        {showAddForm && isAdmin && (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-2xl mb-12">
            <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Add New Parking Place</h2>
            <form onSubmit={handleAddSpot} className="space-y-6">
              {/* Basic Information */}
              <div>
                <label className="block text-sm font-medium mb-2">Parking Place Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
                  placeholder="e.g., Central Plaza Parking"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
                  placeholder="e.g., MG Road, Mumbai"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Total Parking Spots *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalSpots}
                  onChange={(e) => setFormData({ ...formData, totalSpots: e.target.value })}
                  className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
                  placeholder="e.g., 50"
                  required
                />
              </div>

              {/* Pricing Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Pricing (₹)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['bike', 'car', 'bus', 'truck'].map(vehicleType => (
                    <div key={vehicleType} className="border border-gray-300 dark:border-gray-700 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 capitalize">{vehicleType}</h4>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600 dark:text-gray-400">Hourly Rate (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.pricing[vehicleType].hourly}
                          onChange={(e) => updatePricing(vehicleType, 'hourly', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded text-sm text-black dark:text-white"
                          placeholder="Hourly Rate"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Features</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {['cctv', 'security', 'lighting', 'covered', 'ev_charging', 'wheelchair_accessible', 'valet', 'car_wash', '24/7'].map(feature => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm">{getFeatureIcon(feature)} {getFeatureLabel(feature)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Add Parking Place
              </button>
            </form>
          </div>
        )}

        {/* Search Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Search Parking Places</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Search by Place or Location</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search parking place name or location..."
                className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-black dark:text-white"
              />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-7 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Parking Spots Display */}
        {(() => {
          const filteredSpots = spots.filter(spot => {
            const matchesSearch = !searchQuery ||
              spot.spotNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              spot.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              spot.name?.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesSearch;
          });

          if (spots.length === 0) {
            return (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-12 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl text-center">
                <div className="text-8xl mb-6 animate-bounce">🚗</div>
                <p className="text-gray-600 dark:text-gray-400 text-2xl mb-3 font-semibold">No parking spots available yet.</p>
                {isAdmin ? (
                  <p className="text-gray-700 dark:text-gray-500">Click "+ Add Parking Place" above to create your first parking place!</p>
                ) : (
                  <p className="text-gray-700 dark:text-gray-500">Please check back later or contact an administrator.</p>
                )}
              </div>
            );
          }

          if (filteredSpots.length === 0) {
            return (
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-12 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-xl text-center">
                <div className="text-8xl mb-6">🔍</div>
                <p className="text-gray-600 dark:text-gray-400 text-2xl mb-3 font-semibold">No parking spots match your search criteria.</p>
                <p className="text-gray-700 dark:text-gray-500">Try adjusting your filters or clearing them to see all available spots.</p>
              </div>
            );
          }

          return (
            <>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Found {filteredSpots.length} parking place{filteredSpots.length !== 1 ? 's' : ''}
                {searchQuery && ' matching your search'}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSpots.map((spot) => {
                  const availableSpots = spot.availableSpots ?? (spot.isAvailable ? spot.totalSpots || 1 : 0);
                  const totalSpots = spot.totalSpots || 1;
                  const availabilityPercent = (availableSpots / totalSpots) * 100;

                  // Calculate lowest hourly price
                  let lowestPrice = spot.pricePerHour || 0;
                  if (spot.pricing) {
                    const prices = Object.values(spot.pricing)
                      .map(p => p.hourly)
                      .filter(p => p > 0);
                    if (prices.length > 0) {
                      lowestPrice = Math.min(...prices);
                    }
                  }

                  return (
                    <div
                      key={spot._id}
                      onClick={() => setViewingSpot(spot)}
                      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                    >
                      {/* Parking Place Name */}
                      <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {spot.name || `Spot ${spot.spotNumber}`}
                      </h3>

                      {/* Location */}
                      <p className="text-gray-600 dark:text-gray-400 mb-4 flex items-center">
                        <span className="mr-2">📍</span>
                        {spot.location}
                      </p>

                      {/* Hourly Fee */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-xl">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starts from</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          ₹{lowestPrice}
                          <span className="text-lg">/hr</span>
                        </p>
                      </div>

                      {/* Click to view more indicator */}
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                        Click to view details →
                      </p>
                    </div>
                  );
                })}
              </div>
            </>
          );
        })()}

        {/* Details Modal */}
        {viewingSpot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                      {viewingSpot.name || `Spot ${viewingSpot.spotNumber}`}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">📍 {viewingSpot.location}</p>
                  </div>
                  <button
                    onClick={() => setViewingSpot(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    {/* Capacity & Availability */}
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                      <h3 className="text-lg font-bold mb-3">Capacity & Availability</h3>
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Total Spots</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white">{viewingSpot.totalSpots || 1}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Available</p>
                          <p className="text-xl font-bold text-green-600 dark:text-green-400">
                            {viewingSpot.availableSpots ?? (viewingSpot.isAvailable ? viewingSpot.totalSpots || 1 : 0)}
                          </p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${(viewingSpot.availableSpots ?? (viewingSpot.isAvailable ? viewingSpot.totalSpots || 1 : 0)) > 0 ? 'bg-green-500' : 'bg-red-500'}`}
                          style={{ width: `${((viewingSpot.availableSpots ?? (viewingSpot.isAvailable ? viewingSpot.totalSpots || 1 : 0)) / (viewingSpot.totalSpots || 1)) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Features */}
                    {viewingSpot.features && viewingSpot.features.length > 0 && (
                      <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                        <h3 className="text-lg font-bold mb-3">Features & Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {viewingSpot.features.map(feature => {
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
                            return (
                              <span key={feature} className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-semibold">
                                {icons[feature] || '✓'} {labels[feature] || feature}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Booking Status */}
                    {!viewingSpot.isAvailable && viewingSpot.bookedBy && (
                      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                        <h3 className="text-lg font-bold mb-2 text-red-700 dark:text-red-400">Currently Booked</h3>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          By: <span className="font-semibold">{viewingSpot.bookedBy.name || viewingSpot.bookedBy.email}</span>
                        </p>
                        {viewingSpot.bookedUntil && (
                          <p className="text-sm text-gray-700 dark:text-gray-300">
                            Until: <span className="font-semibold">{new Date(viewingSpot.bookedUntil).toLocaleString()}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Column - Pricing */}
                  {viewingSpot.pricing && (
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
                      <h3 className="text-lg font-bold mb-3">Pricing</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(viewingSpot.pricing).map(([vehicle, prices]) => (
                          prices.hourly > 0 && (
                            <div key={vehicle} className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
                              <h4 className="font-bold capitalize text-sm mb-2 text-blue-600 dark:text-blue-400">{vehicle}</h4>
                              <div className="space-y-1 text-xs">
                                <div className="flex justify-between">
                                  <span className="text-gray-600 dark:text-gray-400">Hourly:</span>
                                  <span className="font-semibold">₹{prices.hourly}</span>
                                </div>
                              </div>
                            </div>
                          )
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 justify-end border-t border-gray-200 dark:border-gray-700 pt-4">
                  {user && !isAdmin && (viewingSpot.availableSpots ?? (viewingSpot.isAvailable ? viewingSpot.totalSpots || 1 : 0)) > 0 && (
                    <button
                      onClick={() => {
                        setBookingSpot(viewingSpot);
                        setViewingSpot(null);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition text-sm"
                    >
                      📅 Book Now
                    </button>
                  )}

                  {!viewingSpot.isAvailable && user && (isAdmin || viewingSpot.bookedBy?._id?.toString() === user._id?.toString() || viewingSpot.bookedBy?._id?.toString() === user.id?.toString()) && (
                    <button
                      onClick={() => {
                        handleReleaseSpot(viewingSpot._id);
                        setViewingSpot(null);
                      }}
                      className="px-5 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition text-sm"
                    >
                      🔓 Release
                    </button>
                  )}

                  {isAdmin && (
                    <>
                      <button
                        onClick={() => {
                          setViewingSpot(null);
                          startEditSpot(viewingSpot);
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition text-sm"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteSpot(viewingSpot._id);
                          setViewingSpot(null);
                        }}
                        className="px-5 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition text-sm"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => setViewingSpot(null)}
                    className="px-5 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {bookingSpot && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                      Book Parking Spot
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{bookingSpot.name || `Spot ${bookingSpot.spotNumber}`}</p>
                  </div>
                  <button
                    onClick={() => setBookingSpot(null)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                  >
                    ✕
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleBookSpot} className="space-y-4">
                  {/* Vehicle Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Vehicle Type</label>
                    <select
                      value={selectedVehicleType}
                      onChange={(e) => setSelectedVehicleType(e.target.value)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-black dark:text-white"
                    >
                      <option value="bike">🏍️ Bike - ₹{bookingSpot.pricing?.bike?.hourly || 20}/hr</option>
                      <option value="car">🚗 Car - ₹{bookingSpot.pricing?.car?.hourly || 40}/hr</option>
                      <option value="bus">🚌 Bus - ₹{bookingSpot.pricing?.bus?.hourly || 100}/hr</option>
                      <option value="truck">🚚 Truck - ₹{bookingSpot.pricing?.truck?.hourly || 80}/hr</option>
                    </select>
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Start Time</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="text-2xl group-focus-within:scale-110 transition-transform duration-300">🕐</span>
                      </div>
                      <DatePicker
                        selected={bookingStart ? new Date(bookingStart) : null}
                        onChange={(date) => setBookingStart(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        minDate={new Date()}
                        placeholderText="Select Start Time"
                        className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 cursor-pointer font-medium hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  {/* End Time */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">End Time</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                        <span className="text-2xl group-focus-within:scale-110 transition-transform duration-300">⏰</span>
                      </div>
                      <DatePicker
                        selected={bookingEnd ? new Date(bookingEnd) : null}
                        onChange={(date) => setBookingEnd(date)}
                        showTimeSelect
                        dateFormat="Pp"
                        minDate={bookingStart ? new Date(bookingStart) : new Date()}
                        placeholderText="Select End Time"
                        className="w-full pl-14 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 text-gray-900 dark:text-white placeholder-gray-400 transition-all duration-300 cursor-pointer font-medium hover:bg-gray-100 dark:hover:bg-gray-700 w-full"
                        wrapperClassName="w-full"
                      />
                    </div>
                  </div>

                  {/* Number of Spots */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Number of Parking Spots</label>
                    <input
                      type="number"
                      min="1"
                      max={bookingSpot.availableSpots || 1}
                      value={spotsToBook}
                      onChange={(e) => setSpotsToBook(parseInt(e.target.value) || 1)}
                      className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:border-green-500 text-black dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Available: {bookingSpot.availableSpots || 1} spot{(bookingSpot.availableSpots || 1) !== 1 ? 's' : ''}
                    </p>
                  </div>

                  {/* Price Summary */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700 dark:text-gray-300">Estimated Total:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        ₹{bookingCost.toFixed(2)}
                      </span>
                    </div>
                    {bookingStart && bookingEnd && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {(Math.max(0, (new Date(bookingEnd) - new Date(bookingStart)) / (1000 * 60 * 60))).toFixed(1)} hrs × {spotsToBook} spot(s) × ₹{bookingSpot.pricing?.[selectedVehicleType]?.hourly || bookingSpot.pricePerHour || 0}/hr
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setBookingSpot(null)}
                      className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!bookingStart || !bookingEnd || bookingCost <= 0}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Confirm Booking
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {editingSpot && editFormData && (
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
                              <label className="text-xs text-gray-600 dark:text-gray-400">Hourly</label>
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
        )}
      </div>
    </div>
  );
};

export default ParkingSpots;
