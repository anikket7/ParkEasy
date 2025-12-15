import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold">
              🚗 Smart Parking Solutions
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Cost-Effective
            </span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">Parking System</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Smart parking solutions that save you time and money. Find and reserve parking spots effortlessly with our modern platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
                >
                  <span className="relative z-10">Get Started Free</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  to="/about"
                  className="px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                >
                  Learn More
                </Link>
              </>
            ) : null}
          </div>
        </div>

        {/* User Dashboard Preview */}
        {user && (
          <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-900/50 p-10 rounded-3xl border border-blue-200 dark:border-gray-700 shadow-xl mb-20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Welcome back, {user.name}!</h2>

                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                {isAdmin
                  ? 'You have admin access. Manage parking spots and users from your dashboard.'
                  : 'View your parking history and manage your bookings.'}
              </p>
              <Link
                to="/parking"
                className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                View Parking Spots →
              </Link>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="group relative bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:rotate-6 transition-transform">
                💰
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Cost-Effective</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Save money with our affordable parking rates and flexible payment options. No hidden fees.
              </p>
            </div>
          </div>
          <div className="group relative bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:rotate-6 transition-transform">
                ⚡
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Fast & Easy</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Quick booking process. Find and reserve parking in seconds with our intuitive interface.
              </p>
            </div>
          </div>
          <div className="group relative bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 text-3xl transform group-hover:rotate-6 transition-transform">
                🔒
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Secure</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Your data and payments are protected with industry-standard security and encryption.
              </p>
            </div>
          </div>
        </div>


        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">100+</div>
            <div className="text-gray-600 dark:text-gray-400">Parking Spots</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">Available</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">5K+</div>
            <div className="text-gray-600 dark:text-gray-400">Happy Users</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-300">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">99%</div>
            <div className="text-gray-600 dark:text-gray-400">Satisfaction</div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Get started in three simple steps</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  1
                </div>
                <div className="text-5xl mb-4 mt-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Search Location</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Browse available parking spots near your destination with real-time availability
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  2
                </div>
                <div className="text-5xl mb-4 mt-4">📅</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Book Your Spot</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Reserve your parking spot instantly with flexible booking options
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border-2 border-pink-200 dark:border-pink-800 hover:shadow-2xl transition-all duration-300">
                <div className="absolute -top-6 left-8 w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  3
                </div>
                <div className="text-5xl mb-4 mt-4">🚗</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Park & Enjoy</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Arrive at your spot hassle-free and enjoy your time worry-free
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Preview */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Affordable Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Choose the plan that works for you</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🏍️</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Bike</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-2">₹10</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">per hour</p>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> Secure parking
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> 24/7 access
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> CCTV surveillance
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-2xl shadow-2xl transform scale-105">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-yellow-400 text-gray-900 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold mb-2 text-white">Car</h3>
                <div className="text-4xl font-bold text-white mb-2">₹25</div>
                <p className="text-blue-100 mb-6">per hour</p>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span> Covered parking
                  </li>
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span> EV charging
                  </li>
                  <li className="flex items-center text-white">
                    <span className="text-yellow-300 mr-2">✓</span> Valet service
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300">
              <div className="text-center">
                <div className="text-4xl mb-4">🚚</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Truck</h3>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">₹50</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">per hour</p>
                <ul className="text-left space-y-3 mb-6">
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> Large vehicle space
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> Loading assistance
                  </li>
                  <li className="flex items-center text-gray-600 dark:text-gray-400">
                    <span className="text-green-500 mr-2">✓</span> Security guard
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Trusted by thousands of happy customers</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Rahul Sharma</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "Best parking app I've used! Super easy to find spots and the prices are very reasonable."
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Priya Patel</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "Saved me so much time! No more driving around looking for parking. Highly recommended!"
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white">Amit Kumar</h4>
                  <div className="text-yellow-400">⭐⭐⭐⭐⭐</div>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 italic">
                "The booking process is seamless and the spots are always available. Great service!"
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            <details className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <summary className="font-bold text-lg text-gray-900 dark:text-white cursor-pointer">
                How do I book a parking spot?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Simply browse available spots, select your preferred location, choose the number of spots and duration, then confirm your booking. It's that easy!
              </p>
            </details>
            <details className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <summary className="font-bold text-lg text-gray-900 dark:text-white cursor-pointer">
                Can I cancel my booking?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Yes! You can cancel your booking anytime from your profile page. The spot will be released and made available for others.
              </p>
            </details>
            <details className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <summary className="font-bold text-lg text-gray-900 dark:text-white cursor-pointer">
                What payment methods do you accept?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                We accept all major credit/debit cards, UPI, net banking, and digital wallets for your convenience.
              </p>
            </details>
            <details className="bg-white dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300">
              <summary className="font-bold text-lg text-gray-900 dark:text-white cursor-pointer">
                Is my vehicle safe?
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                Absolutely! All our parking locations have 24/7 CCTV surveillance and security personnel to ensure your vehicle's safety.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
