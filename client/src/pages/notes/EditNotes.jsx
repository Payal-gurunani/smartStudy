import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";

export default function EditNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await apiRequest({
          method: endpoints.getNote(id).method,
          url: endpoints.getNote(id).url,
        });
        const noteData = res?.data || res;
        setNote({
          ...noteData,
          tags: Array.isArray(noteData.tags) ? noteData.tags.join(", ") : "",
        });
      } catch (err) {
        console.error("Fetch note error:", err);
        toast.error("Failed to fetch note");
      }
    };
    fetchNote();
  }, [id]);

  const handleChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { method, url } = endpoints.updateNote(id);
      await apiRequest({
        method,
        url,
        data: {
          ...note,
          tags: note.tags.split(",").map((tag) => tag.trim()),
        },
      });
      toast.success("Note updated");
      navigate("/notes/view");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!note) {
    return <div className="min-h-screen bg-gray-900 text-white p-6">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 sm:ml-60 px-6 py-10 w-full">
        {/* Mobile Header */}
        <div className="sm:hidden mb-6 flex justify-between items-center">
          <button onClick={() => setIsSidebarOpen(true)}>
            <FiMenu className="text-2xl text-white" />
          </button>
          <h2 className="text-lg font-semibold">Edit Note</h2>
        </div>

        <div className="max-w-2xl mx-auto bg-gray-800 p-8 rounded-2xl shadow-xl border border-gray-700">
          <h1 className="text-3xl font-bold mb-4">✏️ Edit Note</h1>
          <p className="text-sm text-gray-400 mb-6">Modify your note details below</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Title</label>
              <input
                name="title"
                value={note.title}
                onChange={handleChange}
                placeholder="e.g. Chemical Reactions"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Subject</label>
              <input
                name="subject"
                value={note.subject}
                onChange={handleChange}
                placeholder="e.g. Chemistry"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">
                Tags <span className="text-gray-400">(comma-separated)</span>
              </label>
              <input
                name="tags"
                value={note.tags}
                onChange={handleChange}
                placeholder="e.g. reactions, acids, bases"
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-300">Content</label>
              <textarea
                name="content"
                value={note.content}
                onChange={handleChange}
                rows={6}
                placeholder="Edit your note content..."
                className="w-full px-4 py-2 rounded bg-gray-700 text-white border border-gray-600 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit */}
            <div className="text-right">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-full transition"
              >
                💾 Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
