import { useEffect, useState } from "react";
import { apiRequest } from "../api/apiRequest";
import { endpoints } from "../api/endPoints";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [notesCount, setNotesCount] = useState(0);

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
        console.log("Notes count:", notesRes.length);
      } catch (err) {
        console.error("Failed to load profile or notes", err);
      }
    };

    fetchData();
  }, []);

  if (!profile) {
    return <div className="text-white p-8">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">
      <div className="max-w-xl mx-auto bg-slate-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Your Profile</h1>
        <p><strong>Username:</strong> {profile.username}</p>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Role:</strong> {profile.role}</p>
        <p><strong>Total Notes:</strong> {notesCount}</p>
      </div>
    </div>
  );
}
