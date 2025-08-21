import { useState } from "react";
import API from "../../axios/axi";

function Signup({ toggle }) {
    const [name,setName]=useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister= async (e)=>{
        e.preventDefault();
        try{
            const {data}= await API.post("/auth/register", {name,email,password});
            localStorage.setItem("token",data.token);
            alert("Registration Successful");
        }catch(error){
            console.error(error.message);
            alert("Registration Failed");
        }
    }

  return (
    <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
      <form className="flex flex-col gap-4" onSubmit={handleRegister}>
        <input
          type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Enter your password"
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition"
        >
          Create Account
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account?{" "}
        <button
          onClick={toggle}
          className="text-purple-600 font-semibold hover:underline"
        >
          Login
        </button>
      </p>
    </div>
  );
}

export default Signup;
