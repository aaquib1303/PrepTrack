import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; // 👈 Import this
import Login from "./components/Login/login";
import Signup from "./components/Register/register";
import Navbar from "./components/Navbar/navbar";
import Home from "./components/Home/home";
import Problems from "./components/Problems/problems";
import ProblemDetail from "./components/Problems/problemDetails";
import Leaderboard from "./components/Leaderboard/leaderboard";
import Profile from "./components/Profile/profile";
import ProtectedRoute from "./components/protectedRoute";
import AddProblem from "./components/Admin/AddProblem";
import AdminRoute from "./components/Auth/adminRoute"; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-950 text-slate-200 font-sans">
      <Toaster position="top-center" toastOptions={{
        style: {
          background: '#334155',
          color: '#fff',
        },
      }}/>
      
      <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
      
      <div className="flex-1 flex justify-center items-start pt-6 pb-10 px-4">
        {/* Max width container keeps things centered on huge screens */}
        <div className="w-full max-w-7xl"> 
           <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
          />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          {/* ✅ ADD THESE MISSING ROUTES BACK IN */}
          <Route path="/problems" element={<Problems />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/problems/:id" element={<ProblemDetail />} />
           
           {/* The guard WRAPS the child route */}
<Route element={<AdminRoute />}>
   <Route path="/admin/add-problem" element={<AddProblem />} />
</Route>
        </Routes>
        </div>
      </div>
    </div>
  
  );
}
export default App;


