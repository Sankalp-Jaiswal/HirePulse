const Layout = ({ children }) => {
  const handleLogout = () => {
    localStorage.removeItem("google_token");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen wavy-bg">
      {/* Glassy Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-white">HirePulse</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-24 mt-16">
        <div className="max-w-7xl w-full text-center transition-all duration-1000 opacity-100 translate-y-0">
          <div className="hero-bg">
            {children}
          </div>
        </div>
      </div>

      <style jsx>{`
        .wavy-bg {
          background: #0f172a;
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
          background: #0c1425;
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

export default Layout;
