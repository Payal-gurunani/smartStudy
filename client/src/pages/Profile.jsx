import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { endpoints } from "../api/endPoints";
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext";
export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [notesCount, setNotesCount] = useState(0);
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();
    const { setIsAuthenticated } = useAuth();
  
  const handleLogout = async () => {
    try {
      await apiRequest({
        method: endpoints.logout.method,
        url: endpoints.logout.url,
      });
    } catch (err) {
      console.error('Logout error:', err.message);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('visitedBefore');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await apiRequest({
          method: endpoints.Profile.method,
          url: endpoints.Profile.url,
        });

        setProfile(profileRes);

        const notesRes = await apiRequest({
          method: endpoints.getNotes.method,
          url: endpoints.getNotes.url,
        });
        setNotesCount(notesRes.length || 0);

        const progressRes = await apiRequest({
          method: "GET",
          url: "/progress",
        });
       
        setProgress(progressRes);
      } catch (err) {
        console.error("Failed to load profile, notes, or progress", err);
      }
    };

    fetchData();
  }, []);

  if (!profile || !progress) {
    return <div className="text-white p-8">Loading profile...</div>;
  }

  const joinedYear = new Date(profile.createdAt).getFullYear();

  return (
    <div className="min-h-screen bg-gray-900 px-6 py-12 text-gray-100">
      <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center text-center">
          {/* <img
            src="/avatar-placeholder.png"
            alt="User avatar"
            className="w-24 h-24 rounded-full mb-4"
          /> */}
          <h2 className="text-2xl font-bold">{profile.username}</h2>
          <p className="text-sm text-gray-500">{profile.email}</p>
          <p className="text-sm text-gray-400">Joined in {joinedYear}</p>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-800">
            Edit Profile
          </button>
        </div>

        <h3 className="mt-10 text-xl font-semibold">Study Progress</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 ">
          <Card title="Courses Completed" value={progress.quizzes.totalQuizzes} />
          <Card title="Average Score" value={`${progress.quizzes.avgScore}%`} />
          <Card title="Notes Created" value={notesCount} />
          <Card title="Flashcards Reviewed" value={progress.flashcards.totalFlashcardReviews} />
          <Card title="Reminders Completed" value={progress.reminders.completed} />
          <Card title="Pending Reminders" value={progress.reminders.pending} />
        </div>

        <h3 className="mt-10 text-xl font-semibold">Settings</h3>
        <div className="space-y-2 mt-4">
          {["Account Settings", "Notifications", "Privacy", "Help & Support"].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-3 bg-gray-900 rounded-lg hover:bg-gray-800 cursor-pointer">
              <span>{item}</span>
              <span className="text-gray-300">→</span>
            </div>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-[#E4580B] hover:bg-red-600 px-4 py-1.5 rounded-lg transition text-white font-semibold shadow-sm cursor-pointer justify-center"
          >
            <FiLogOut className="text-lg" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 shadow-sm text-center text-white">
      <p className="text-sm text-gray-100 ">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}
