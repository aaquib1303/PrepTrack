import { Navigate, Outlet } from "react-router-dom";
import toast from "react-hot-toast";

const AdminRoute = () => {
  // 1. Get user info from storage
  const userInfoString = localStorage.getItem("userInfo");
  const token = localStorage.getItem("token");

  // 2. Parse it safely
  let user = null;
  if (userInfoString) {
    try {
      user = JSON.parse(userInfoString);
    } catch (error) {
      console.error("User info parsing error", error);
    }
  }
console.log("--- ADMIN GUARD CHECK ---");
  console.log("Token exists?", !!token);
  console.log("User object:", user);
  console.log("Is Admin?", user?.isAdmin);
  // 3. Check Conditions
  // Must have a token AND be an admin
  if (token && user && user.isAdmin) {
    return <Outlet />; // ✅ Authorized? Render the child route (AddProblem)
  } else {
    // ❌ Not authorized? Kick them out.
    // Use a toast to explain why (optional but nice)
    // We use a slight timeout to avoid toast conflicts during render
    setTimeout(() => {
        // Only toast if they are logged in but not admin
        if(token && user && !user.isAdmin) toast.error("Admins only!");
    }, 100);
    
    return <Navigate to="/" replace />;
  }
};

export default AdminRoute;