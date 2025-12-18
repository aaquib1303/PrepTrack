import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import API from "../../axios/axi";
import toast from "react-hot-toast"; // Recommend adding toast for errors

function Login({ setIsLoggedIn, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); 

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      console.log("LOGIN RESPONSE DATA:", data);
      // Save data
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(data));
      
      // Update State
      setIsLoggedIn(true);
      setUser(data);
      
      toast.success("Welcome back!");
      navigate("/"); // Redirect to Home
    } catch (error) {
      console.error(error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh]">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fade-in-up">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
          <p className="text-gray-400 mt-2 text-sm">Enter your credentials to access your account.</p>
        </div>

        <form className="flex flex-col gap-5" onSubmit={handleLogin}>
          <div>
            <label className="text-gray-300 text-sm font-bold mb-2 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600"
              required
            />
          </div>
          
          <div>
            <label className="text-gray-300 text-sm font-bold mb-2 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-600"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing In..." : "Login Now"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-400">
          Not a member?{" "}
          <Link to="/register" className="text-blue-400 font-bold hover:text-blue-300 transition-colors">
            Sign Up Now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;