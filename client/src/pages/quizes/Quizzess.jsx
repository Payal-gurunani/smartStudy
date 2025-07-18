import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { Link } from "react-router-dom";
import { endpoints } from "../../api/endPoints";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Quizzess = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate()
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest({
          method: endpoints.getAllQuizStatus.method,
          url: endpoints.getAllQuizStatus.url,
        });
        setQuizzes(res);
      } catch (err) {
        console.error("Failed to load quiz list");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="text-center text-white mt-10">Loading quizzes...</p>;
  if (quizzes.length === 0)
    {
      return ( 
         <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white space-y-4">
  <p>No quizzes available. Please generate a quiz first.</p>
  <Link to="/notes/view">
    <button className="bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold">
      Go to Notes
    </button>
  </Link>
</div>
      )
    } 

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-4 py-6 sm:px-8 sm:py-10 w-full">
        <div className="max-w-6xl mx-auto">

          {/* Mobile Top Bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
          </div>

          {/* Header */}
          <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
            <h2 className="text-3xl font-bold">Quizzes</h2>
            <Link to="/quizzes/results">
              <button className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold text-white">
                Quiz Results
              </button>
            </Link>
          </div>

          {/* Quiz List */}
          <div className="space-y-6">
            {quizzes.map((q) => (
              <div
                key={q.noteId}
                className="flex flex-col gap-4 bg-gray-800 rounded-2xl p-4 sm:p-6 shadow-md border border-gray-700 hover:shadow-lg transition"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold break-words">{q.title}</h3>
                  <p className="text-sm text-gray-400">
                    Status:{" "}
                    <span className={`font-medium ${q.attempted ? "text-green-400" : "text-yellow-400"}`}>
                      {q.attempted ? "Attempted" : "Not Attempted"}
                    </span>
                  </p>

                  {q.attempted && (
                    <>
                      <p className="text-sm text-gray-300">
                        Last Score: <span className="font-bold text-emerald-400">{q.lastScore}%</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Attempted on:{" "}
                        {new Date(q.lastAttemptedAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </>
                  )}
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      className="bg-emerald-600 cursor-pointer hover:bg-emerald-700 px-4 py-1.5 rounded text-sm font-semibold"
                      onClick={async () => {
                        try {
                          const { method, url } = endpoints.getNote(q.noteId);
                          const res = await apiRequest({ method, url });

                          if (res.quiz && res.quiz.length > 0) {
                            navigate(`/quizzes/${q.noteId}/attempt`);
                          } else {
                            toast.info("No quiz found. Redirecting to Generate Quiz page.");
                            navigate(`/notes/${q.noteId}/quiz/generate`);
                          }
                        } catch (err) {
                          toast.error("Error checking quiz availability");
                          console.error(err);
                        }
                      }}
                    >
                      {q.attempted ? "Retake Quiz" : "Start Quiz"}
                    </button>

                    {q.attempted && q.resultId && (
                      <Link to={`/quizzes/result/${q.resultId}`}>
                        <button className="bg-gray-700 cursor-pointer hover:bg-gray-600 px-4 py-1.5 rounded text-sm">
                          View Result
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Quizzess;
