import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { PencilLine } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";

export default function CreateNote() {
  const [note, setNote] = useState({ title: "", content: "", tags: "", subject: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiRequest({
        method: endpoints.createNote.method,
        url: endpoints.createNote.url,
        data: { ...note, tags: note.tags.split(",").map((t) => t.trim()) },
      });
      toast.success(" Note created successfully");
      navigate("/notes/view");
    } catch {
      toast.error(" Failed to create note");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-4 sm:px-8 py-10 w-full">
        {/* Mobile Menu Button */}
        <div className="sm:hidden mb-6 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="text-2xl text-white" />
          </button>
        </div>

        <div className="max-w-2xl mx-auto bg-white/5 p-6 sm:p-8 rounded-2xl shadow-lg border border-white/10">
          <div className="flex items-center justify-center mb-6">
            <PencilLine className="h-6 w-6 text-blue-400 mr-2" />
            <h2 className="text-3xl font-semibold tracking-wide">Create a New Note</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 text-sm text-slate-300">Title</label>
              <input
                name="title"
                value={note.title}
                onChange={handleChange}
                placeholder="e.g. Introduction to Biology"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-300">Subject</label>
              <input
                name="subject"
                value={note.subject}
                onChange={handleChange}
                placeholder="e.g. Biology"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-300">Tags (comma-separated)</label>
              <input
                name="tags"
                value={note.tags}
                onChange={handleChange}
                placeholder="e.g. cells, DNA, genetics"
                className="w-full px-4 py-2 bg-white/10 text-white rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm text-slate-300">Content</label>
              <textarea
                name="content"
                value={note.content}
                onChange={handleChange}
                placeholder="Write your note content here..."
                className="w-full px-4 py-3 bg-white/10 text-white rounded-lg border border-white/20 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded-xl transition duration-300 font-semibold text-white tracking-wide"
            >
              ➕ Create Note
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
