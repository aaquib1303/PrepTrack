import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // Added Link
import API from "../../axios/axi";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import Skeleton from "../Common/Skeleton";

export default function ProblemDetails() {
  const { id } = useParams();
  const [problem, setProblem] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 👈 Track login status locally

  // Editor State
  const [code, setCode] = useState(""); 
  const [language, setLanguage] = useState("cpp"); 
  
  // Output State
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState("");
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Tabs State
  const [activeTab, setActiveTab] = useState("description"); 
  const [submissions, setSubmissions] = useState([]);

  // ✅ CHECK LOGIN STATUS ON MOUNT
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // ✅ HELPER: Safely extract code
  const getStarterCode = (stubData, lang) => {
    if (!stubData) return "";
    // Handle Array format (New)
    if (Array.isArray(stubData)) {
      const found = stubData.find((s) => s.language === lang);
      return found ? found.code : "";
    }
    // Handle Object format (Old)
    return stubData[lang] || "";
  };

  // 1. Fetch Problem Data
  useEffect(() => {
    const fetchProblem = async () => {
      setPageLoading(true);
      try {
        const { data } = await API.get(`/problems/${id}`);
        setProblem(data);
        
        // Load C++ stub by default
        const initialCode = getStarterCode(data.functionStub, "cpp");
        setCode(initialCode || "// No starter code provided for this language."); 
        setLanguage("cpp"); 
      } catch (err) {
        console.error("Failed to fetch problem:", err);
      } finally {
        setPageLoading(false);
      }
    };
    fetchProblem();
  }, [id]);

  // 2. Fetch Submissions (ONLY IF LOGGED IN)
  useEffect(() => {
    if (activeTab === "submissions" && isLoggedIn) { // 👈 Check isLoggedIn
      const fetchSubmissions = async () => {
        try {
          const { data } = await API.get(`/submissions/${id}`);
          setSubmissions(data);
        } catch (err) {
          console.error("Failed to fetch submissions");
        }
      };
      fetchSubmissions();
    }
  }, [activeTab, id, isLoggedIn]);

  // 3. Handle Language Change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    if (problem) {
      const newCode = getStarterCode(problem.functionStub, newLang);
      setCode(newCode || "// No starter code provided for this language.");
    }
  };

  const handleRun = async () => {
    if (!isLoggedIn) return toast.error("Please login to run code");
    
    setRunLoading(true);
    setStatus("Running...");
    setOutput("");
    console.log("👉 SENDING TO BACKEND:", { problemId, code, language });

    try {
      const { data } = await API.post("/run", {
        problemId: id,
        code,
        language,
      });

      
      const formattedOutput = data.results.map((res, i) => 
        `Case ${i+1}: ${res.passed ? 'Passed ✅' : 'Failed ❌'}\n` +
        `Input: ${res.input}\n` +
        `Expected: ${res.expected}\n` +
        `Got: ${res.got}`
      ).join('\n\n');
      
      setStatus(data.results.every(r => r.passed) ? "Sample Tests Passed" : "Sample Tests Failed");
      setOutput(formattedOutput);
    } catch (err) {
      setOutput(err.response?.data?.output || "An error occurred");
      setStatus("Error");
    } finally {
      setRunLoading(false);
    }
  };

  const loadSubmissionCode = (submission) => {
    setCode(submission.code);
    setLanguage(submission.language);
    toast.success(`Loaded ${submission.language} submission`);
  };
  
  const handleSubmit = async () => {
    if (!isLoggedIn) return toast.error("Please login to submit code");

    setSubmitLoading(true);
    const loadingToast = toast.loading("Submitting Code...");

    try {
      const { data } = await API.post("/submissions", {
        problemId: id,
        code,
        language,
      });

      setOutput(data.output);
      setStatus(data.status);
      toast.dismiss(loadingToast);

      if (data.status === "Accepted") {
        toast.success("Accepted! Great job! 🎉");
      } else {
        toast.error(`Verdict: ${data.status} ❌`);
      }

    } catch (err) {
      toast.dismiss(loadingToast);
      toast.error(err.response?.data?.output || "Submission Failed");
      setStatus("Error");
    } finally {
      setSubmitLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="bg-gray-900 border border-gray-800 w-full max-w-7xl rounded-2xl shadow-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 h-[85vh]">
        <div className="space-y-4">
          <Skeleton className="h-10 w-3/4 mb-4 bg-gray-800" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
            <Skeleton className="h-6 w-16 rounded-full bg-gray-800" />
          </div>
          <Skeleton className="h-4 w-full bg-gray-800" />
          <Skeleton className="h-4 w-5/6 bg-gray-800" />
        </div>
        <div className="flex flex-col space-y-4">
           <Skeleton className="h-10 w-40 bg-gray-800" />
           <Skeleton className="h-[50vh] w-full rounded-lg bg-gray-800" />
        </div>
      </div>
    );
  }
  
  if (!problem) return <p className="text-white text-center mt-10">Problem not found.</p>;

  return (
    <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 h-[85vh]">
      
      {/* --- LEFT PANEL --- */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-800 bg-gray-950/50 px-4 pt-2">
          <button
            className={`mr-6 pb-3 pt-3 font-semibold text-sm transition-colors duration-200 ${
              activeTab === "description" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
            }`}
            onClick={() => setActiveTab("description")}
          >
            Description
          </button>
          {/* Only show Submissions tab if logged in */}
          {isLoggedIn && (
            <button
              className={`pb-3 pt-3 font-semibold text-sm transition-colors duration-200 ${
                activeTab === "submissions" ? "text-blue-400 border-b-2 border-blue-500" : "text-gray-400 hover:text-white"
              }`}
              onClick={() => setActiveTab("submissions")}
            >
              Submissions
            </button>
          )}
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
            {activeTab === "description" ? (
            <div className="animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">{problem.title}</h1>
                {/* Tags & Difficulty */}
            <div className="flex flex-wrap gap-2 mb-6">
              {/* Difficulty Badge */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  problem.difficulty === "Hard" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  problem.difficulty === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                  "bg-green-500/10 text-green-400 border-green-500/20"
              }`}>
                  {problem.difficulty}
              </span>

              {/* Problem Tags - Rendered dynamically */}
              {problem.tags && problem.tags.map((tag, idx) => (
                 <span key={idx} className="px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-300 border border-gray-700">
                    {tag}
                 </span>
              ))}
            </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-300 whitespace-pre-line leading-relaxed">
                {problem.description}
                </div>
            </div>
            ) : (
            <div className="animate-fade-in">
                <h2 className="text-lg font-bold text-white mb-4">Your Submissions</h2>
                {submissions.length === 0 ? (
                <p className="text-gray-500 italic">No submissions yet.</p>
                ) : (
                <div className="space-y-3">
                    {submissions.map((sub) => (
                    <div 
                        key={sub._id} 
                        onClick={() => loadSubmissionCode(sub)}
                        className="group border border-gray-700 bg-gray-800/50 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-gray-800 hover:border-blue-500 transition-all duration-200"
                    >
                        <div>
                        <p className={`font-bold text-sm ${sub.status === "Accepted" ? "text-green-400" : "text-red-400"}`}>
                            {sub.status}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{new Date(sub.createdAt).toLocaleString()}</p>
                        </div>
                        <span className="text-xs font-mono bg-gray-950 text-gray-300 border border-gray-700 px-2 py-1 rounded">
                        {sub.language}
                        </span>
                    </div>
                    ))}
                </div>
                )}
            </div>
            )}
        </div>
      </div>

      {/* --- RIGHT PANEL (Code Editor) --- */}
      <div className="flex flex-col h-[85vh]">
        <div className="mb-3 flex justify-between items-center">
          <select 
            value={language} 
            onChange={handleLanguageChange} 
            className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 block w-40 p-2.5 outline-none font-medium"
          >
            <option value="cpp">C++</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
          </select>
          
          {/* LOGIN REMINDER */}
          {!isLoggedIn && (
            <Link to="/login" className="text-xs text-blue-400 hover:text-blue-300 font-bold underline">
              Log in to save progress
            </Link>
          )}
        </div>
        
        <div className="flex-grow rounded-xl overflow-hidden border border-gray-700 shadow-2xl">
          <Editor
            height="100%"
            language={language === "cpp" ? "cpp" : language}
            theme="vs-dark"
            value={code} 
            onChange={(value) => setCode(value || "")}
            options={{ 
              minimap: { enabled: false },
              fontSize: 14,
              fontFamily: '"JetBrains Mono", monospace',
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>
        
        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {isLoggedIn ? (
            <>
              <button
                onClick={handleRun}
                disabled={runLoading || submitLoading}
                className="flex-1 px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50 border border-gray-600"
              >
                {runLoading ? "Running..." : "Run Code"}
              </button>
              <button
                onClick={handleSubmit}
                disabled={runLoading || submitLoading}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg font-bold transition-all shadow-lg disabled:opacity-50"
              >
                {submitLoading ? "Submitting..." : "Submit"}
              </button>
            </>
          ) : (
            <Link to="/login" className="flex-1 text-center px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-colors shadow-lg">
              Login to Submit
            </Link>
          )}
        </div>
        
        <div className="mt-4 p-4 bg-gray-950 rounded-xl border border-gray-800 h-40 overflow-y-auto font-mono text-sm custom-scrollbar shadow-inner">
          <h3 className={`font-bold mb-2 uppercase text-xs tracking-wider ${
            status === 'Accepted' ? 'text-green-400' :
            status.includes('Failed') || status === 'Wrong Answer' ? 'text-red-400' : 'text-gray-500'
          }`}>
            {status || "Output Console"}
          </h3>
          <pre className="whitespace-pre-wrap text-gray-300">
            {output || <span className="text-gray-600 italic">Run your code to see results here...</span>}
          </pre>
        </div>
      </div>
    </div>
  );
}