import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";

const GenerateQuiz = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    let called = false;
    (async () => {
      if (called) return;
      called = true;

      try {
        const { method, url } = endpoints.getNote(noteId);
        const note = await apiRequest({ method, url });

        if (note?.quiz && note.quiz.length > 0) {
          const userWantsNew = window.confirm(
            "A quiz is already generated for this note. Do you want to generate a new quiz with different questions?"
          );

          if (!userWantsNew) {
            localStorage.setItem(`quiz-${noteId}`, JSON.stringify(note.quiz));
            toast.info("Using previously generated quiz.");
            navigate(`/quizzes/${noteId}/attempt`, {
              state: { from: location.state?.from || "/notes" },
            });
            return;
          }
        }

        const res = await apiRequest(endpoints.generateQuiz(noteId));
        localStorage.setItem(`quiz-${noteId}`, JSON.stringify(res));
        toast.success("New quiz generated!");
        navigate(`/quizzes/${noteId}/attempt`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Quiz generation failed");
        setLoading(false);
      }
    })();
  }, [noteId, navigate]);

  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <div className="fixed top-16 left-0 w-60 h-full z-50 bg-slate-900 border-r border-gray-800">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-60 px-4 py-6 sm:px-10 sm:py-10 w-full">
        <div className="max-w-5xl mx-auto">
          {/* Mobile Top Bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
            <h2 className="text-lg font-semibold">Generate Quiz</h2>
          </div>

          {/* Loading / Error UI */}
          <div className="grid h-[60vh] place-items-center">
            {loading ? (
              <div className="flex items-center gap-3 text-gray-300 text-lg">
                <Loader2 className="animate-spin w-6 h-6" />
                Generating your quiz…
              </div>
            ) : (
              <p className="text-red-400 text-lg">Failed to generate quiz. Please try again.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerateQuiz;
