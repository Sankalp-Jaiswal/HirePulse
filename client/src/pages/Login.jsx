import { GoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import Layout from "../components/Layout";


const Login = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  
  const dynamicWords = ["Intelligent", "Efficient", "Accurate", "Smart"];
  const handleLoginSuccess = (res) => {
    localStorage.setItem("google_token", res.credential);
    window.location.href = "/dashboard";
  };

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % dynamicWords.length);
    }, 2500);

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen wavy-bg">
      {/* Glassy Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-white">HirePulse</span>
            </div>
            <div className="hidden md:block">
              <GoogleLogin
                onSuccess={handleLoginSuccess}
                onError={() => alert("Login failed")}
                theme="filled_black"
                size="medium"
                text="signin_with"
                shape="pill"
              />
            </div>
            {/* <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">Contact</a>
            </div> */}
          </div>
        </div>
      </nav>

      

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 mt-16">
        {/* Main Content Container */}
        <div
          className={`max-w-7xl w-full text-center transition-all duration-1000 transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          {/* Hero Section */}
          <div className="mb-16 hero-bg">
            <div className="inline-block relative mb-6">
              <h1 className="text-7xl md:text-8xl font-extrabold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                HirePulse
              </h1>
              <div className="absolute -top-2 -right-2 w-5 h-5 bg-blue-400 rounded-full animate-ping"></div>
            </div>

            {/* Dynamic Tagline */}
            <div className="mb-6 h-16 relative">
              <p className="text-2xl md:text-3xl text-gray-300 font-medium flex items-center flex-col justify-center mb-4">
                <span className="inline-block relative w-48 h-12">
                  {dynamicWords.map((word, index) => (
                    <span
                      key={word}
                      className={`absolute left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
                        index === currentWord
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-4"
                      }`}
                      style={{
                        background: "linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {word}
                    </span>
                  ))}
                </span>
                <span className="text-white pb-12">Resume Ranking</span>
              </p>
            </div>

            <p className="text-gray-400 mb-12 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Leverage AI-powered technology to match the perfect candidates with your job descriptions in seconds. 
              Transform your hiring process with intelligent automation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              {/* Login is now in the bottom section */}
              {/* <a href="#demo" className="px-8 py-4 bg-gray-800/50 backdrop-blur-sm text-white rounded-xl font-semibold border border-gray-700 hover:bg-gray-700/50 transform hover:scale-105 transition-all duration-300">
                Watch Demo
              </a> */}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
              {[
                { number: "10K+", label: "Resumes Analyzed" },
                { number: "95%", label: "Accuracy Rate" },
                { number: "5min", label: "Time Saved" },
                { number: "500+", label: "Happy Clients" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center transform transition-all duration-300 hover:scale-110 bg-gray-900/50 backdrop-blur-sm p-6 rounded-xl border border-gray-800/50 hover:border-purple-500/50"
                >
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Section */}
          <div id="features" className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Everything you need to streamline your recruitment process
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  title: "Precise Matching", 
                  description: "Our advanced AI algorithms meticulously analyze every resume against your job description, ensuring you get candidates that truly match your requirements. With 95% accuracy rate, we help you identify the best talent from hundreds of applications.",
                  delay: "100",
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  ),
                  title: "Lightning Fast", 
                  description: "Process hundreds of resumes in mere seconds, not hours or days. Our powerful cloud infrastructure ensures instant results, allowing you to move quickly on top candidates before your competitors do. Save up to 80% of screening time.",
                  delay: "200",
                  color: "from-purple-500 to-pink-500"
                },
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  ),
                  title: "Data-Driven Insights", 
                  description: "Get comprehensive analytics and detailed insights on every candidate. View skill match percentages, experience relevance scores, and comparative rankings. Make informed hiring decisions backed by concrete data and AI-powered recommendations.",
                  delay: "300",
                  color: "from-orange-500 to-red-500"
                },
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  ),
                  title: "Secure & Private", 
                  description: "Enterprise-grade security with end-to-end encryption ensures your sensitive hiring data remains completely confidential. SOC 2 Type II certified, GDPR compliant, and regular security audits guarantee your candidates' information is protected.",
                  delay: "400",
                  color: "from-green-500 to-emerald-500"
                },
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  ),
                  title: "Smart Automation", 
                  description: "Automate repetitive screening tasks and focus your energy on what truly matters - engaging with top talent. Custom workflows, automated candidate communications, and intelligent filtering save your HR team countless hours every week.",
                  delay: "500",
                  color: "from-indigo-500 to-purple-500"
                },
                { 
                  icon: (
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                  ),
                  title: "Scalable Solution", 
                  description: "Whether you're a startup hiring your first employees or an enterprise processing thousands of applications, HirePulse scales seamlessly with your needs. Flexible pricing tiers and unlimited processing power grow with your business.",
                  delay: "600",
                  color: "from-pink-500 to-rose-500"
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-800/50 hover:border-purple-500/50 group"
                  style={{
                    animation: `fadeInUp 0.6s ease-out ${feature.delay}ms both`,
                  }}
                >
                  <div className="text-blue-400 mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className={`font-bold text-xl text-transparent bg-clip-text bg-gradient-to-r ${feature.color} mb-4`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Simple, streamlined process to find your perfect candidate
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { 
                  step: "01", 
                  title: "Upload Job Description", 
                  description: "Paste or upload your job requirements and let our AI understand the role",
                  icon: (
                    <svg className="w-16 h-16 mx-auto text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  )
                },
                { 
                  step: "02", 
                  title: "Add Resumes", 
                  description: "Batch upload candidate resumes in any format - PDF, DOC, or plain text",
                  icon: (
                    <svg className="w-16 h-16 mx-auto text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  )
                },
                { 
                  step: "03", 
                  title: "AI Analysis", 
                  description: "Our AI engine ranks and scores each resume based on job requirements",
                  icon: (
                    <svg className="w-16 h-16 mx-auto text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  )
                },
                { 
                  step: "04", 
                  title: "Get Results", 
                  description: "Review ranked candidates instantly with detailed match scores and insights",
                  icon: (
                    <svg className="w-16 h-16 mx-auto text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )
                },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="bg-gray-900/60 backdrop-blur-md p-6 rounded-2xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 h-full">
                    <div className="mb-4">{item.icon}</div>
                    <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-3">
                      {item.step}
                    </div>
                    <h3 className="text-white font-semibold text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {item.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gradient-to-r from-purple-500 to-transparent"></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              See what our customers have to say
            </p>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "HirePulse cut our screening time by 80%. Game changer for our HR team!",
                  author: "Sarah Johnson",
                  role: "HR Director, TechCorp",
                  rating: 5
                },
                {
                  quote: "The accuracy is incredible. We're finding better candidates faster than ever.",
                  author: "Michael Chen",
                  role: "Talent Acquisition, StartupXYZ",
                  rating: 5
                },
                {
                  quote: "Intuitive, powerful, and saves us countless hours every week.",
                  author: "Emily Rodriguez",
                  role: "Recruiter, Global Solutions",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="border-t border-gray-700 pt-4">
                    <p className="text-white font-semibold">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Login Section */}
          <div id="login" className="mb-20">
            <div className="bg-gray-900/80 backdrop-blur-xl p-12 rounded-3xl shadow-2xl max-w-lg mx-auto border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
              <h2 className="text-3xl font-bold text-white mb-3">
                Ready to Transform Hiring?
              </h2>
              <p className="text-gray-400 mb-8">
                Sign in with Google to get started in seconds
              </p>
              
              <div className="flex justify-center transform transition-transform duration-300 hover:scale-105 mb-6">
                <GoogleLogin
                  onSuccess={handleLoginSuccess}
                  onError={() => alert("Login failed")}
                  theme="filled_black"
                  size="large"
                  text="continue_with"
                  shape="rectangular"
                />
              </div>

              <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Free 14-day trial
                </div>
                <div className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  No credit card required
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-8 border-t border-gray-700 pt-4">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 pt-12 pb-8">
            {/* no reference link as of now */}
            {/* <div className="grid md:grid-cols-4 gap-8 mb-8 text-left">
              <div>
                <h4 className="text-white font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div> */}
            <div className="text-center text-gray-500 text-sm">
              <p>© 2026 HirePulse. All rights reserved. </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes wave {
          0% {
            transform: translateX(0) translateY(0);
          }
          100% {
            transform: translateX(-50%) translateY(5%);
          }
        }

        @keyframes grid-flow {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(40px);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-grid-flow {
          animation: grid-flow 20s linear infinite;
        }

        .wave-layer {
          position: absolute;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: wave 20s linear infinite;
        }

        .wave1 {
          opacity: 0.4;
          animation-duration: 25s;
        }

        .wave2 {
          opacity: 0.3;
          animation-duration: 18s;
          animation-delay: -5s;
        }

        .wave3 {
          opacity: 0.25;
          animation-duration: 30s;
          animation-delay: -10s;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar for dark theme */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #1f2937;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }

        .wavy-bg {
          background: #0f172a; /* darker blue */
          position: relative;
          overflow: hidden;
        }

        .wavy-bg::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          background-image: repeating-linear-gradient(
            45deg,
            rgba(255,255,255,0.08) 0px,
            rgba(255,255,255,0.08) 2px,
            transparent 2px,
            transparent 200px
          ),
          repeating-linear-gradient(
            -45deg,
            rgba(255,255,255,0.08) 0px,
            rgba(255,255,255,0.08) 2px,
            transparent 2px,
            transparent 200px
          );
        }

        .hero-bg {
          background: #0c1425; /* plain dark */
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
          border-radius: 1rem;
          margin: 2rem 0;
        }
      `}</style>
    </div>
  );
};

export default Login;





















