import { useState } from "react";
import toast from "react-hot-toast";
import API from "../../axios/axi";

export default function AddProblem() {
  const [activeLang, setActiveLang] = useState("cpp"); // To toggle tabs

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    slug: "",
    tags: "", // 👈 Added tags state
    testCases: [], 
    templates: { cpp: "", javascript: "", python: "" },
    functionStub: { cpp: "", javascript: "", python: "" }
  });

  const [jsonInput, setJsonInput] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTemplateChange = (lang, field, value) => {
    setFormData({
      ...formData,
      [field]: { ...formData[field], [lang]: value }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Prepare Test Cases
      let parsedTestCases = [];
      if (jsonInput) {
        try {
          const rawCases = JSON.parse(jsonInput);
          parsedTestCases = rawCases.map(tc => ({
            input: tc.input,
            expectedOutput: tc.expectedOutput || tc.output 
          }));
        } catch (err) {
          toast.error("Invalid JSON in Test Cases field!");
          return;
        }
      }

      // 2. Prepare Tags (Split string into Array)
      const parsedTags = formData.tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t !== "");

      // 3. Format Templates & Stubs
      const formattedTemplates = Object.keys(formData.templates)
        .filter(lang => formData.templates[lang].trim() !== "")
        .map(lang => ({ language: lang, code: formData.templates[lang] }));

      const formattedStubs = Object.keys(formData.functionStub)
        .filter(lang => formData.functionStub[lang].trim() !== "")
        .map(lang => ({ language: lang, code: formData.functionStub[lang] }));

      // 4. Build Payload
      const finalPayload = {
        ...formData,
        tags: parsedTags, // 👈 Send array to backend
        testCases: parsedTestCases,
        templates: formattedTemplates,
        functionStub: formattedStubs
      };

      // 5. Send
      await API.post("/problems", finalPayload);
      toast.success("Problem Created Successfully! 🚀");
      
      // Clear form
      setFormData({
        title: "", description: "", difficulty: "Easy", slug: "", tags: "",
        testCases: [], templates: { cpp: "", javascript: "", python: "" }, functionStub: { cpp: "", javascript: "", python: "" }
      });
      setJsonInput("");

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "Failed to create problem.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 my-10 animate-fade-in-up">
      <div className="bg-gray-900 border border-gray-800 shadow-2xl rounded-2xl p-8">
        
        <div className="mb-8 border-b border-gray-800 pb-4">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Add New Problem 🛠️</h1>
            <p className="text-gray-400 mt-2">Create a new coding challenge for the platform.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Title</label>
              <input 
                name="title" 
                value={formData.title}
                onChange={handleChange} 
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600" 
                placeholder="e.g. Valid Anagram" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">Difficulty</label>
              <select 
                name="difficulty" 
                value={formData.difficulty}
                onChange={handleChange} 
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Slug & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Slug (URL-friendly)</label>
                <input 
                    name="slug" 
                    value={formData.slug}
                    onChange={handleChange} 
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600" 
                    placeholder="valid-anagram" 
                    required 
                />
            </div>
            {/* ✅ NEW TAGS INPUT */}
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-2">Tags (Comma Separated)</label>
                <input 
                    name="tags" 
                    value={formData.tags}
                    onChange={handleChange} 
                    className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600" 
                    placeholder="e.g. Array, Hash Map, Sorting" 
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-300 mb-2">Description (Markdown Supported)</label>
            <textarea 
                name="description" 
                value={formData.description}
                onChange={handleChange} 
                rows="6" 
                className="w-full bg-gray-950 border border-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-600 font-sans" 
                placeholder="Write the problem statement here..."
                required 
            />
          </div>

          {/* Templates Section */}
          <div className="border-t border-gray-800 pt-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Code Templates</h3>
                
                {/* Language Tabs */}
                <div className="flex gap-2 bg-gray-950 p-1 rounded-lg border border-gray-700">
                    {["cpp", "javascript", "python"].map(lang => (
                        <button
                            key={lang}
                            type="button" // Prevent form submission
                            onClick={() => setActiveLang(lang)}
                            className={`px-4 py-1 rounded-md text-sm font-bold capitalize transition-all ${
                                activeLang === lang 
                                ? "bg-blue-600 text-white shadow-lg" 
                                : "text-gray-400 hover:text-white"
                            }`}
                        >
                            {lang === "cpp" ? "C++" : lang}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    {activeLang} Driver Code (Hidden)
                </label>
                <textarea 
                  className="w-full bg-gray-950 border border-gray-700 text-gray-300 rounded-lg p-3 font-mono text-xs h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" 
                  value={formData.templates[activeLang]}
                  onChange={(e) => handleTemplateChange(activeLang, "templates", e.target.value)}
                  placeholder={`Paste ${activeLang} driver code here...`}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-gray-500 mb-2">
                    {activeLang} User Stub (Visible)
                </label>
                <textarea 
                  className="w-full bg-gray-950 border border-gray-700 text-gray-300 rounded-lg p-3 font-mono text-xs h-64 focus:outline-none focus:ring-2 focus:ring-blue-500 custom-scrollbar" 
                  value={formData.functionStub[activeLang]}
                  onChange={(e) => handleTemplateChange(activeLang, "functionStub", e.target.value)}
                  placeholder={`Paste ${activeLang} user stub here...`}
                />
              </div>
            </div>
          </div>

          {/* Test Cases Section */}
          <div className="border-t border-gray-800 pt-6">
            <label className="block text-sm font-bold text-gray-300 mb-2">Test Cases (JSON Format)</label>
            <p className="text-xs text-gray-500 mb-3 font-mono bg-gray-800 p-2 rounded w-fit">
              {`Format: [{"input": "...", "output": "..."}]`}
            </p>
            <textarea 
              value={jsonInput} 
              onChange={(e) => setJsonInput(e.target.value)} 
              rows="6" 
              className="w-full bg-gray-950 border border-gray-700 text-green-400 font-mono text-sm rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-700"
              placeholder='[{"input": "1 2", "output": "3"}]'
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 mt-4"
          >
            Create Problem
          </button>
        </form>
      </div>
    </div>
  );
}