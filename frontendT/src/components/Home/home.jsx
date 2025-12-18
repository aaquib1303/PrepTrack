import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../axios/axi";
import Skeleton from "../Common/Skeleton";

export default function Home() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true); 
      try {
        const { data } = await API.get(`/problems?search=${search}&difficulty=${difficulty}`);
        setProblems(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchProblems();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [search, difficulty]);

  return (
    <div className="max-w-6xl mx-auto p-6 min-h-[80vh]">
      
      {/* --- HEADER & FILTERS --- */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 animate-fade-in-up">
        <div>
           <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">Problem Set</h1>
           <p className="text-gray-400 mt-2 text-lg font-medium">Sharpen your skills with our curated list of challenges.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative group">
             <input
                type="text"
                placeholder="Search questions..."
                className="bg-gray-900 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-md placeholder-gray-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
             />
             <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          {/* Difficulty Dropdown */}
          <div className="relative">
            <select
                className="appearance-none bg-gray-900 border border-gray-700 text-white rounded-lg pl-4 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer w-full font-medium"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
            >
                <option value="All">All Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
            </select>
             <svg className="w-4 h-4 absolute right-3 top-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* --- PROBLEM LIST --- */}
      {loading ? (
        <div className="space-y-3">
           <Skeleton className="h-16 w-full rounded-lg bg-gray-800" />
           <Skeleton className="h-16 w-full rounded-lg bg-gray-800" />
           <Skeleton className="h-16 w-full rounded-lg bg-gray-800" />
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-700">
            <p className="text-gray-400 text-lg">No problems found matching these filters.</p>
            <button 
                onClick={() => {setSearch(""); setDifficulty("All")}}
                className="mt-3 text-blue-400 hover:text-blue-300 font-bold transition-colors"
            >
                Clear Filters
            </button>
        </div>
      ) : (
        <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-950 border-b border-gray-800">
              <tr>
                <th className="px-6 py-5 font-bold text-gray-300 text-sm uppercase tracking-wider">Title</th>
                <th className="px-6 py-5 font-bold text-gray-300 text-sm uppercase tracking-wider">Difficulty</th>
                <th className="px-6 py-5 font-bold text-gray-300 text-sm uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {problems.map((prob) => (
                <tr key={prob._id} className="hover:bg-gray-800/50 transition duration-150 group">
                  <td className="px-6 py-5 font-semibold text-lg">
                    <Link to={`/problems/${prob._id}`} className="text-white group-hover:text-blue-400 transition-colors block">
                      {prob.title}
                    </Link>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      prob.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      prob.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {prob.difficulty}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      to={`/problems/${prob._id}`}
                      className="inline-block bg-gray-800 hover:bg-blue-600 text-white border border-gray-600 hover:border-blue-500 px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-blue-500/25"
                    >
                      Solve
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}