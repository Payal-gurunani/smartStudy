import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";

const QuizResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest({
          method: endpoints.getQuizResults.method,
          url: endpoints.getQuizResults.url,
        });

        setResults([...(res || [])].sort(
          (a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt)
        ));
      } catch (err) {
        setError(true);
        toast.error("Could not load quiz results.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="grid h-[70vh] place-items-center text-white bg-slate-900">
        <Loader2 className="animate-spin w-6 h-6 mr-2" />
        Loading your quiz results…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 mt-10 bg-slate-900 min-h-screen">
        Something went wrong. Please refresh the page.
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center text-gray-400 mt-10 bg-slate-900 min-h-screen">
        No attempts yet.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-4 py-6 sm:px-8 sm:py-10 w-full">
        <div className="max-w-5xl mx-auto">

          {/* Mobile Top Bar */}
          <div className="sm:hidden mb-6 flex justify-between items-center">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
          </div>

          <h2 className="text-3xl font-bold mb-8">My Quiz Results</h2>

          <div className="space-y-6">
            {results.map((r) => {
              const scoreColor =
                r.score >= 80 ? "text-green-400"
                : r.score >= 50 ? "text-yellow-400"
                : "text-red-400";

              return (
                <Link
                  to={`/quizzes/result/${r._id}`}
                  key={r._id}
                  className="block"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-5 rounded-xl transition"
                  >
                    <p className="text-lg font-semibold mb-1">{r.title || "Untitled Quiz"}</p>
                    <div className="flex flex-wrap gap-6 text-sm sm:text-base">
                      <p>
                        Score:{" "}
                        <span className={`font-bold ${scoreColor}`}>
                          {r.score}%
                        </span>
                      </p>
                      <p>
                        Correct:{" "}
                        <span className="font-semibold">
                          {r.correct}/{r.total}
                        </span>
                      </p>
                      <p className="text-gray-400">
                        Attempted on:{" "}
                        {new Date(r.attemptedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizResults;
