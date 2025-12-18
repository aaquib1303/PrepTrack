import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../axios/axi"; 

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setIsValid(false);
        return;
      }

      try {
        // We assume /auth/profile or /auth/me verifies the token
        const res = await API.get("/auth/profile"); 
        if (res.data) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (err) {
        setIsValid(false);
        // If token is invalid, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return isValid ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;