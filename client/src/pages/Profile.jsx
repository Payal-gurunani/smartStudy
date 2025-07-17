// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { endpoints } from "../api/endPoints";
import { FiLogOut, FiMenu } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
import Sidebar from "../components/Sidebar";
import { Loader2 } from "lucide-react";
import { replace } from "lodash";

export default function Profile() {
  const [profile, setProfile]       = useState(null);
  const [notesCount, setNotesCount] = useState(0);
  const [progress, setProgress]     = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated ,setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await apiRequest(endpoints.logout);
     
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
     
      setIsAuthenticated(false);
      setUser(null)
      navigate("/",{replace : true});
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const profileRes  = await apiRequest(endpoints.Profile);
        const notesRes    = await apiRequest(endpoints.getNotes);
        const progressRes = await apiRequest(endpoints.progress);
        // console.log(profileRes);
        
        setProfile(profileRes);
        setNotesCount(notesRes.length || 0);
        setProgress(progressRes);
      } catch (err) {
        console.error("Failed to load profile data", err);
      }
    })();
  }, []);

  if (!profile || !progress) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-900 text-white">
        <span className="flex items-center gap-2 text-white/80">
          <Loader2 className="w-6 h-6 animate-spin" />
          Loading profile…
        </span>
      </div>
    );
  }
console.log(progress);

  const joinedYear = new Date(profile.createdAt).getFullYear();

  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main */}
      <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 sm:ml-60">
        <div className="mx-auto max-w-3xl">
          {/* Mobile Top Bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setSidebarOpen(true)}>
              <FiMenu className="text-2xl" />
            </button>
          </div>

          {/* Profile Card */}
          <div className="bg-white/5 ring-1 ring-white/10 rounded-2xl shadow-lg p-8">
            <div className="flex flex-col items-center text-center gap-1">
              <h2 className="text-2xl font-bold">{profile.username}</h2>
              <p className="text-sm text-gray-300">{profile.email}</p>
              <p className="text-sm text-gray-400">Joined in {joinedYear}</p>
            </div>

            {/* Progress */}
            <h3 className="mt-10 text-xl font-semibold">Study Progress</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
              <Card title="Quizzes Taken"   value={progress.quizzes.totalQuizzes} />
              <Card title="Average Score"   value={`${progress.quizzes.avgScore}%`} />
              <Card title="Notes Created"   value={notesCount} />
              <Card title="Flashcards Reviewed" value={progress.flashcards.totalFlashcardReviews} />
              <Card title="Reminders Done"  value={progress.reminders.completed} />
              <Card title="Pending Reminders" value={progress.reminders.pending} />
            </div>

            {/* Settings */}
            <h3 className="mt-10 text-xl font-semibold">Settings</h3>
            <div className="space-y-2 mt-4">
              {["Account Settings", "Notifications", "Privacy", "Help & Support"].map((item) => (
                <div
                  key={item}
                  className="flex justify-between items-center bg-white/5 hover:bg-white/10 p-3 rounded-lg cursor-pointer"
                >
                  <span>{item}</span>
                  <span className="text-gray-300">→</span>
                </div>
              ))}

              <button
                onClick={handleLogout}
                className="w-full cursor-pointer flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 py-2 rounded-lg font-semibold mt-4"
              >
                <FiLogOut className="text-lg " />
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white/5 hover:bg-white/10 rounded-lg p-4 text-center ring-1 ring-white/10">
      <p className="text-sm text-gray-300">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
