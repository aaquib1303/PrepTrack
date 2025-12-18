import { useEffect, useState } from "react";
import API from "../../axios/axi";
import Skeleton from "../Common/Skeleton";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await API.get("/auth/leaderboard");
        setUsers(data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      <Skeleton className="h-24 w-full rounded-2xl bg-gray-800 mb-6" />
      <Skeleton className="h-64 w-full rounded-2xl bg-gray-800" />
    </div>
  );

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 px-4">
      {/* Header Card */}
      <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-8 mb-8 shadow-2xl text-white border border-blue-500/30">
        <h1 className="text-4xl font-extrabold flex items-center gap-3 drop-shadow-md">
          🏆 Global Leaderboard
        </h1>
        <p className="text-blue-100 mt-2 font-medium text-lg">See who's dominating the coding charts.</p>
      </div>
      
      {/* Table Container */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {users.length === 0 ? (
          <div className="p-10 text-center text-gray-500">No users found yet.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-950 border-b border-gray-800 text-xs uppercase tracking-wider text-gray-400">
                <th className="px-6 py-5 font-bold">Rank</th>
                <th className="px-6 py-5 font-bold">User</th>
                <th className="px-6 py-5 font-bold text-right">Problems Solved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((user, idx) => {
                // High Contrast Rank Colors
                let rankStyle = "text-gray-400 font-bold";
                let rowBg = "hover:bg-gray-800/50";
                
                if (idx === 0) { rankStyle = "text-yellow-400 text-2xl drop-shadow-sm"; rowBg = "bg-yellow-500/10 hover:bg-yellow-500/20"; }
                else if (idx === 1) { rankStyle = "text-gray-300 text-xl"; rowBg = "bg-gray-700/20 hover:bg-gray-700/30"; }
                else if (idx === 2) { rankStyle = "text-orange-400 text-xl"; rowBg = "bg-orange-500/10 hover:bg-orange-500/20"; }

                return (
                  <tr key={user._id} className={`transition-colors duration-200 ${rowBg}`}>
                    <td className={`px-6 py-4 ${rankStyle}`}>
                      #{idx + 1}
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-white text-lg">{user.name}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-block px-4 py-1.5 bg-blue-900/40 text-blue-300 border border-blue-700/50 rounded-full text-sm font-bold">
                        {user.solvedCount}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}