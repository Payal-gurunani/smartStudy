import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FiFileText, FiMenu } from "react-icons/fi";
import Sidebar from "../../components/Sidebar";

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await apiRequest({
        method: endpoints.getNotes.method,
        url: endpoints.getNotes.url,
      });

      const data = res?.data || res?.notes || res;
      if (!Array.isArray(data)) throw new Error("Unexpected response format");
      setNotes(data);
    } catch (err) {
      console.error("Fetch notes error:", err);
      toast.error("Failed to fetch notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-4 sm:px-6 py-6 sm:py-8 w-full">
        <div className="max-w-4xl mx-auto">

          {/* Mobile Top Bar */}
          <div className="sm:hidden flex flex-col gap-3 mb-4">
            <div className="flex justify-between items-center">
              <button onClick={() => setIsSidebarOpen(true)}>
                <FiMenu className="text-2xl" />
              </button>
              <div className="flex gap-2">
                <Link
                  to="/notes/create"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm"
                >
                  + New Note
                </Link>
                <Link
                  to="/notes/upload"
                  className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm"
                >
                  Upload PDF
                </Link>
              </div>
            </div>
          </div>

          {/* Desktop Top Bar */}
          <div className="hidden sm:flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Notes</h2>
            <div className="flex gap-3">
              <Link
                to="/notes/upload"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm"
              >
                Upload PDF
              </Link>
              <Link
                to="/notes/create"
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full text-sm"
              >
                + New Note
              </Link>
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search notes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/10 text-white placeholder-gray-300 px-4 py-2 rounded-lg focus:outline-none"
            />
          </div>

          {/* Tabs */}
          <div className="flex gap-6 mb-5 border-b border-white/20 pb-1 text-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-1 ${
                activeTab === "all"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-gray-400"
              }`}
            >
              All Notes
            </button>
            <button
              onClick={() => setActiveTab("subjects")}
              className={`pb-1 ${
                activeTab === "subjects"
                  ? "border-b-2 border-blue-400 text-white"
                  : "text-gray-400"
              }`}
            >
              Subjects
            </button>
          </div>

          {/* Notes */}
          {filteredNotes.length === 0 ? (
            <p className="text-gray-400">No notes found.</p>
          ) : (
            <div className="space-y-4">
              <h3 className="text-md font-semibold text-white">Recent</h3>
              {filteredNotes.map((note) => (
                <Link
                  to={`/notes/${note._id}`}
                  key={note._id}
                  className="flex items-center gap-3 p-4 bg-white/10 hover:bg-white/20 rounded-lg transition"
                >
                  <FiFileText className="text-white text-xl" />
                  <div>
                    <h4 className="text-white font-medium">{note.title}</h4>
                    <p className="text-sm text-blue-300">{note.subject || "No subject"}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
