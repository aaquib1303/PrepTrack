import React,{useState} from "react";
import API from "../../axios/axi";

function Login({ toggle }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin= async (e)=>{
        e.preventDefault();
        try{
            const {data}= await API.post("/auth/login", {email,password});
            localStorage.setItem("token",data.token);
            alert("Login Successful");
        }catch(error){
            console.error(error.message);
            alert("Login Failed");
        }
    }

  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Login</h2>
      <form className="flex flex-col gap-4" onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e)=> setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e)=> setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Login Now
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Not a member?{" "}
        <button
          onClick={toggle}
          className="text-purple-600 font-semibold hover:underline"
        >
          Signup Now
        </button>
      </p>
    </div>
  );
}

export default Login;
