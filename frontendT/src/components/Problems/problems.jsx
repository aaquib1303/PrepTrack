import { useState, useEffect } from "react";
import API from "../../axios/axi";
import { Link } from "react-router-dom";
import Skeleton from "../Common/Skeleton";

export default function Problems() {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        const response = await API.get("/problems");
        setProblems(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <Skeleton className="h-10 w-1/3 bg-gray-800 rounded-lg mb-6" />
      <Skeleton className="h-24 w-full bg-gray-800 rounded-xl" />
      <Skeleton className="h-24 w-full bg-gray-800 rounded-xl" />
      <Skeleton className="h-24 w-full bg-gray-800 rounded-xl" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6 min-h-[80vh]">
      
      {/* Header */}
      <div className="mb-8 animate-fade-in-up">
        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
          All Problems
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Browse the complete collection of challenges.
        </p>
      </div>

      {/* Problems List */}
      <div className="space-y-4">
        {Array.isArray(problems) && problems.length > 0 ? (
          problems.map((p) => (
            <Link key={p._id} to={`/problems/${p._id}`} className="block group">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 transition-all duration-200 hover:border-blue-500/50 hover:bg-gray-800 hover:shadow-lg hover:shadow-blue-500/10 relative overflow-hidden">
                
                <div className="flex justify-between items-start relative z-10">
                  
                  {/* Left: Title & Tags */}
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                      {p.title}
                    </h2>
                    
                    {/* ✅ TAGS SECTION */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {p.tags && p.tags.length > 0 ? (
                        p.tags.map((tag, index) => (
                          <span key={index} className="text-xs font-medium font-mono bg-gray-950 text-gray-400 border border-gray-700 px-2 py-1 rounded hover:text-white hover:border-gray-500 transition-colors">
                            {tag}
                          </span>
                        ))
                      ) : (
                        // Optional: Show something if no tags exist
                        <span className="text-xs text-gray-600 italic">No tags</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Difficulty Badge */}
                  <div className="ml-4 flex-shrink-0">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      p.difficulty === "Easy" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                      p.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}>
                      {p.difficulty}
                    </span>
                  </div>
                </div>

                {/* Hover Action Hint */}
                <div className="flex justify-end mt-4">
                   <span className="text-sm font-semibold text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      Solve Challenge &rarr;
                   </span>
                </div>

              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-dashed border-gray-800">
            <p className="text-gray-500 text-lg">No problems available right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}