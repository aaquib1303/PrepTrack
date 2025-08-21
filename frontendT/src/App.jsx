import { useState } from "react";
import Login from "./components/Login/login";
import Signup from "./components/Register/register";

function App() {
  const [showLogin, setShowLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-indigo-700">
      {showLogin ? (
        <Login toggle={() => setShowLogin(false)} />
      ) : (
        <Signup toggle={() => setShowLogin(true)} />
      )}
    </div>
  );
}

export default App;
