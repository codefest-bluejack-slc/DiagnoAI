import React from 'react';

export default function InfoSection() {
  const phases = [
    {
      title: "Discover Your Wellness Journey",
      subtitle: "AI-Powered Health Analysis",
      description: "Advanced artificial intelligence analyzes your symptoms with precision, providing accurate insights into your health condition through intelligent diagnostic algorithms.",
      icon: "🔍",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      title: "Find Your Perfect Solution", 
      subtitle: "Personalized Treatment Plans",
      description: "Receive tailored treatment recommendations based on your unique health profile, ensuring the most effective path to recovery with expert-backed solutions.",
      icon: "💊",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Secure Your Health Today",
      subtitle: "Seamless Healthcare Access", 
      description: "Purchase verified medications and treatments directly through our secure platform, with fast delivery and ongoing health monitoring support.",
      icon: "🛒",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <div className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 text-transparent bg-clip-text text-sm font-semibold tracking-wider uppercase mb-4">
            Revolutionary Healthcare
          </div>
          <h2 
            className="text-6xl font-bold mb-6 text-white"
            style={{
              fontSize: 'clamp(3rem, 6vw, 4.5rem)',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              letterSpacing: '-0.03em',
              lineHeight: '1.1',
            }}
          >
            How DiagnoAI
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 text-transparent bg-clip-text">
              Transforms Healthcare
            </span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Experience the future of healthcare with our intelligent diagnostic platform that puts your wellness first
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {phases.map((phase, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className={`absolute inset-0 bg-gradient-to-r ${phase.gradient} rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
              
              <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 group-hover:border-slate-600/50 transition-all duration-500 group-hover:transform group-hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${phase.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-lg`}>
                    {phase.icon}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-slate-300">
                      0{index + 1}
                    </div>
                  </div>
                </div>
                
                <h3 
                  className="text-2xl font-bold mb-3 text-white group-hover:text-slate-100 transition-colors duration-300"
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 1.75rem)',
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                    lineHeight: '1.3',
                  }}
                >
                  {phase.title}
                </h3>
                
                <div className={`inline-block bg-gradient-to-r ${phase.gradient} text-transparent bg-clip-text font-semibold mb-4`}>
                  {phase.subtitle}
                </div>
                
                <p 
                  className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300"
                  style={{
                    fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                    lineHeight: '1.7',
                  }}
                >
                  {phase.description}
                </p>

                <div className="mt-6 flex items-center justify-between">
                  <div className={`w-full h-1 bg-gradient-to-r ${phase.gradient} rounded-full opacity-60`}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
            <button className="relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-12 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 group-hover:transform group-hover:scale-105 shadow-xl border border-purple-500/20">
              <span className="flex items-center gap-3">
                Start Your Diagnosis
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5-5 5M6 12h12" />
                </svg>
              </span>
            </button>
          </div>
          
          <p className="text-slate-500 text-sm mt-6">
            Join thousands of users who trust DiagnoAI for their health journey
          </p>
        </div>
      </div>
    </section>
  );
}
