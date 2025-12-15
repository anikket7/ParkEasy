const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-black dark:to-gray-900 text-black dark:text-white transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              About Us
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Revolutionizing parking management with innovative technology
          </p>
        </div>
        
        <div className="space-y-8">
          <section className="group relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Our Mission</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                We aim to revolutionize parking management by providing a cost-effective, 
                user-friendly solution that makes finding and reserving parking spaces 
                simple and affordable for everyone. Our platform combines cutting-edge 
                technology with intuitive design to deliver an exceptional user experience.
              </p>
            </div>
          </section>

          <section className="group relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-purple-100 dark:bg-purple-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What We Offer</h2>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-lg">Real-time parking availability tracking</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-lg">Easy online booking system with instant confirmation</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-lg">Flexible payment options and secure transactions</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-lg">24/7 customer support and assistance</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <span className="text-lg">Mobile-friendly interface for on-the-go access</span>
                </li>
              </ul>
            </div>
          </section>

          <section className="group relative bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-10 rounded-3xl border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-40 h-40 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Technology Stack</h2>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">
                Built with modern technologies for optimal performance and user experience:
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900/50 dark:to-gray-800/50 p-6 rounded-2xl border border-blue-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Frontend
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span> React.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span> Tailwind CSS
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-blue-500">•</span> React Router
                    </li>
                  </ul>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900/50 dark:to-gray-800/50 p-6 rounded-2xl border border-purple-200 dark:border-gray-700">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Backend
                  </h3>
                  <ul className="text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span> Node.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span> Express.js
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-500">•</span> MongoDB
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
