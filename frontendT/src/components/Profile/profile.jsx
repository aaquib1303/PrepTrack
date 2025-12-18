import { useEffect, useState } from "react";
import API from "../../axios/axi";
import Skeleton from "../Common/Skeleton"; 

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setProfile(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-6">
         <Skeleton className="h-64 w-full rounded-2xl bg-gray-800" />
         <Skeleton className="h-48 w-full rounded-2xl bg-gray-800" />
      </div>
      <div className="md:col-span-2">
         <Skeleton className="h-full w-full rounded-2xl bg-gray-800 min-h-[400px]" />
      </div>
    </div>
  );

  if (!profile) return <div className="p-8 text-center text-red-400">Failed to load profile.</div>;

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
      
      {/* --- LEFT COLUMN: User Info & Stats --- */}
      <div className="space-y-6">
        
        {/* User Card */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl text-center relative overflow-hidden">
          {/* Background Gradient Line */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-blue-700 to-purple-700 text-white rounded-full flex items-center justify-center text-4xl font-bold mx-auto mb-4 shadow-xl ring-4 ring-gray-800">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{profile.name}</h1>
          <p className="text-gray-400 text-sm mt-1 font-medium">{profile.email}</p>
          <div className="mt-4 inline-block px-4 py-1 bg-gray-800 border border-gray-700 rounded-full text-xs text-gray-300 font-semibold tracking-wide uppercase">
            Member
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl">
          <h2 className="text-lg font-bold text-white mb-6 border-b border-gray-800 pb-3">Progress</h2>
          
          <div className="space-y-6">
            {/* Easy */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-green-400 font-bold">Easy</span>
                <span className="text-gray-400 font-mono">{profile.stats.Easy} solved</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                <div className="bg-green-500 h-3 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-1000" style={{ width: `${Math.min(profile.stats.Easy * 5, 100)}%` }}></div>
              </div>
            </div>

            {/* Medium */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-yellow-400 font-bold">Medium</span>
                <span className="text-gray-400 font-mono">{profile.stats.Medium} solved</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                <div className="bg-yellow-500 h-3 rounded-full shadow-[0_0_10px_rgba(234,179,8,0.5)] transition-all duration-1000" style={{ width: `${Math.min(profile.stats.Medium * 5, 100)}%` }}></div>
              </div>
            </div>

            {/* Hard */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-red-400 font-bold">Hard</span>
                <span className="text-gray-400 font-mono">{profile.stats.Hard} solved</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden border border-gray-700">
                <div className="bg-red-500 h-3 rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)] transition-all duration-1000" style={{ width: `${Math.min(profile.stats.Hard * 5, 100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: Solved Problems List --- */}
      <div className="md:col-span-2">
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl shadow-xl h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Solved Problems</h2>
            <span className="text-xs font-bold text-blue-400 bg-blue-900/20 px-3 py-1 rounded-full border border-blue-800">
                Total: {profile.solvedProblems.length}
            </span>
          </div>
          
          {profile.solvedProblems.length === 0 ? (
            <div className="text-center py-20 text-gray-500 border border-dashed border-gray-800 rounded-xl bg-gray-950/50 flex-1 flex flex-col justify-center items-center">
              <p>You haven't solved any problems yet.</p>
              <a href="/" className="text-blue-400 hover:text-blue-300 mt-2 font-bold transition-colors">Start Coding Now &rarr;</a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[600px] custom-scrollbar pr-2">
              {profile.solvedProblems.map((prob) => (
                <div key={prob._id} className="group flex justify-between items-center p-4 bg-gray-800/40 hover:bg-gray-800 rounded-xl border border-gray-700/50 transition-all duration-200 cursor-default">
                  <span className="font-semibold text-gray-200 group-hover:text-white transition-colors">{prob.title}</span>
                  <span className={`px-3 py-1 text-xs rounded-full font-bold border ${
                    prob.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    prob.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                    "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {prob.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}