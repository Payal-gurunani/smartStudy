// src/pages/GenerateQuiz.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { confirmToast } from "../../utils/confirmToast";     // ⬅️ new

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

    (async () => {
      try {
        /* 1️⃣  Fetch note to see whether a quiz already exists */
        const { method, url } = endpoints.getNote(noteId);
        const note = await apiRequest({ method, url });

        if (note?.quiz?.length) {
          /* 2️⃣  Ask user via toast-dialog instead of window.confirm */
          const generateNew = await confirmToast({
            title: "Quiz already exists",
            message: "Generate a new quiz with different questions?",
            confirmLabel: "Generate New",
            cancelLabel: "Use Existing",
          });

          if (!generateNew) {
            localStorage.setItem(`quiz-${noteId}`, JSON.stringify(note.quiz));
            toast.info("Using previously generated quiz.");
            navigate(`/quizzes/${noteId}/attempt`, {
              state: { from: location.state?.from || "/notes" },
            });
            return;
          }
        }

        /* 3️⃣  Create a fresh quiz */
        const res = await apiRequest(endpoints.generateQuiz(noteId));
        localStorage.setItem(`quiz-${noteId}`, JSON.stringify(res));
        toast.success("New quiz generated!");
        navigate(`/quizzes/${noteId}/attempt`);
      } catch (err) {
        toast.error(err.response?.data?.message || "Quiz generation failed");
        setLoading(false);
      }
    })();
  }, [noteId, navigate, location]);

  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      {/* ───────── Sidebar ───────── */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* ───────── Main ───────── */}
      <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 sm:ml-60">
        <div className="mx-auto max-w-5xl">
          {/* Mobile top bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
            <h2 className="text-lg font-semibold">Generate Quiz</h2>
          </div>

          {/* Loading or error */}
          <div className="grid h-[60vh] place-items-center">
            {loading ? (
              <div className="flex items-center gap-3 text-gray-300 text-lg">
                <Loader2 className="animate-spin w-6 h-6" />
                Generating your quiz…
              </div>
            ) : (
              <p className="text-red-400 text-lg">
                Failed to generate quiz. Please try again.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default GenerateQuiz;
