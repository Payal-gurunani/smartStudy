import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { endpoints } from "../api/endPoints";
import { useAuth } from "../context/Authcontext";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { FiMenu, FiX } from "react-icons/fi";

export default function Dashboard() {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [notesRes, quizRes, progressRes] = await Promise.all([
          apiRequest({ method: endpoints.getNotes.method, url: endpoints.getNotes.url }),
          apiRequest({ method: endpoints.getAllQuizStatus.method, url: endpoints.getAllQuizStatus.url }),
          apiRequest({ method: endpoints.progress.method, url: endpoints.progress.url }),
        ]);

        setNotes(notesRes.slice(0, 3));
        setQuizzes(quizRes.slice(0, 3));
        setProgress(progressRes);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchDashboardData();
  }, [user?._id]);

  const noteMap = notes.reduce((acc, note) => {
    acc[note._id] = note;
    return acc;
  }, {});

  if (loading || !progress) {
    return <div className="text-white p-8">Loading dashboard...</div>;
  }

  return (
    <div className="relative flex min-h-screen bg-slate-900 overflow-x-auto text-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile Sidebar Toggle */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-slate-800 p-2 rounded-md shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
      </button>

      <main className="flex-1 px-4 sm:px-6 py-6 sm:py-10 w-full sm:pl-64">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-1">Welcome back, {user?.username || "Student"}!</h1>
              <p className="text-slate-300">Here’s a snapshot of your study progress.</p>
            </div>
          </div>

          {/* Recent Notes */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {notes.map((note) => (
                <div key={note._id} className="bg-slate-800 p-4 rounded-xl">
                  <img
                    src={
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuB6AzOL2S5LRZw-j3OHIGHQb0McqOM3_7CoodlqfxecrYkurWCaHUIWVEnJxavsyp1SJ5Jvnva1TMWK5E9iV6VSdvYCPGlanMYA6wVLe3CGUpPotOERYabb8ZJ6OzC62ePlBUhnxSTIOwI20I_PZhJTJNuuiOHc6tHf9Y0jlKSM6n_RffR8rXm9hzHfPfCV15Ax5cXyBJhMd-jRzmNyCRKuvk2JXMy4RNrPqVX-RzITj_AXabdycvZv6o2CxxsaOn9wWbrUU34DFuQ"
                    }
                    alt={note.title}
                    className="h-32 w-full object-cover rounded-lg mb-3"
                  />
                  <h3 className="font-semibold line-clamp-2">{note.title}</h3>
                  <p className="text-sm text-slate-400">Last updated: {new Date(note.updatedAt).toDateString()}</p>
                  <Link to={`/notes/${note._id}`} className="block hover:underline text-blue-400 mt-2">
                    View Note
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* Quiz Table */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Upcoming Quizzes</h2>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-800 text-slate-300">
                  <tr>
                    <th className="p-3">Quiz Name</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Last Attempt</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {quizzes.map((quiz) => (
                    <tr key={quiz.resultId || quiz.noteId} className="even:bg-slate-800 odd:bg-slate-900">
                      <td className="p-3">{quiz.title}</td>
                      <td className="p-3 text-blue-400">{noteMap[quiz.noteId]?.subject || "N/A"}</td>
                      <td className="p-3">
                        {quiz.lastAttemptedAt
                          ? new Date(quiz.lastAttemptedAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white ${
                            quiz.attempted ? "bg-green-600" : "bg-yellow-600"
                          }`}
                        >
                          {quiz.attempted ? "Attempted" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Flashcard Progress */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Flashcard Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <ProgressCard title="Total Flashcard Reviews" value={progress.flashcards.totalFlashcardReviews} />
            </div>
          </section>

          {/* Quiz Progress */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold mb-4">Quiz Progress</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <ProgressCard title="Total Quizzes Attempted" value={progress.quizzes.totalQuizzes} />
              <ProgressCard title="Average Score" value={`${progress.quizzes.avgScore}%`} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

function ProgressCard({ title, value }) {
  return (
    <div className="bg-slate-800 p-4 rounded-xl">
      <p className="text-slate-300 text-sm mb-1">{title}</p>
      <h4 className="text-2xl font-bold">{value}</h4>
    </div>
  );
}
