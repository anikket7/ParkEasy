const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              About ParkEasy
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Revolutionizing urban parking with smart, cost-effective solutions for everyone.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="group bg-white dark:bg-gray-800/50 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              To eliminate parking stress by connecting drivers with perfect spots instantly. We make parking accessible, affordable, and hassle-free while empowering administrators with powerful management tools.
            </p>
          </div>

          <div className="group bg-white dark:bg-gray-800/50 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
              To become the leading smart parking platform, transforming how people find and manage parking spaces in urban areas through innovative technology and exceptional user experience.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl mb-16">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Key Features</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: '🔑', title: 'Secure Entry Codes', desc: 'Unique 5-digit codes for every booking ensure secure access' },
              { icon: '⚡', title: 'Instant Booking', desc: 'Find and reserve spots in seconds with real-time availability' },
              { icon: '👁️', title: 'User-Friendly Auth', desc: 'Password visibility toggle and secure JWT authentication' },
              { icon: '👑', title: 'Admin Dashboard', desc: 'Comprehensive tools for managing spots, pricing, and revenue' },
              { icon: '🌗', title: 'Dark Mode', desc: 'Beautiful interface that adapts to your preference' },
              { icon: '📱', title: 'Fully Responsive', desc: 'Seamless experience on desktop, tablet, and mobile devices' }
            ].map((feature, index) => (
              <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors">
                <span className="text-4xl">{feature.icon}</span>
                <div>
                  <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-8 rounded-3xl shadow-2xl mb-16 text-white">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold">Technology Stack</h2>
          </div>
          <p className="mb-8 text-lg opacity-90">Built with modern, scalable technologies for optimal performance</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Frontend
              </h3>
              <ul className="space-y-2 opacity-90">
                <li className="flex items-center gap-2">
                  <span>•</span> React.js 19
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Vite
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Tailwind CSS
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> React Router
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Backend
              </h3>
              <ul className="space-y-2 opacity-90">
                <li className="flex items-center gap-2">
                  <span>•</span> Node.js
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Express.js
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> MongoDB
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Mongoose
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Security
              </h3>
              <ul className="space-y-2 opacity-90">
                <li className="flex items-center gap-2">
                  <span>•</span> JWT Auth
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> bcrypt
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> CORS
                </li>
                <li className="flex items-center gap-2">
                  <span>•</span> Validation
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {[
            { number: '500+', label: 'Parking Spots', color: 'from-blue-600 to-blue-700' },
            { number: '24/7', label: 'Available', color: 'from-purple-600 to-purple-700' },
            { number: '10K+', label: 'Happy Users', color: 'from-pink-600 to-pink-700' },
            { number: '99%', label: 'Satisfaction', color: 'from-green-600 to-green-700' }
          ].map((stat, index) => (
            <div key={index} className="text-center p-8 bg-white dark:bg-gray-800/50 rounded-3xl border-2 border-gray-200 dark:border-gray-700 hover:scale-105 transition-all duration-300 shadow-xl">
              <div className={`text-5xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-3`}>
                {stat.number}
              </div>
              <div className="text-gray-600 dark:text-gray-400 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Team Section */}
        <div className="bg-white dark:bg-gray-800/50 p-8 rounded-3xl border-2 border-gray-200 dark:border-gray-700 shadow-xl">
          <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Our Team
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8 text-lg max-w-2xl mx-auto">
            Built by passionate developers committed to solving real-world parking challenges through innovative technology.
          </p>
          <div className="flex justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-xl">
                P
              </div>
              <h3 className="font-bold text-xl text-gray-900 dark:text-white">ParkEasy Team</h3>
              <p className="text-gray-600 dark:text-gray-400">Lovely Professional University</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
