import { Link } from "react-router-dom";

export default function Navbar({ isLoggedIn, handleLogout }) {
  return (
    // ✨ sticky, backdrop-blur, semi-transparent border
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PrepTrack
            </span>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/problems" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Problems</Link>
            <Link to="/leaderboard" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Leaderboard</Link>
            
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="text-slate-300 hover:text-white transition-colors text-sm font-medium">Profile</Link>
                <button 
                  onClick={handleLogout}
                  className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-500/20"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-slate-300 hover:text-white font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/30">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}