import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";

export default function CreateNote() {
  const [note, setNote] = useState({ title: "", content: "", tags: "", subject: "" });
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
        data: { ...note, tags: note.tags.split(",") },
      });
      toast.success("Note created");
      navigate("/notes/view");
    } catch {
      toast.error("Creation failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg border border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-center">📝 Create a New Note</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Title</label>
            <input
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="e.g. Introduction to Biology"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Subject</label>
            <input
              name="subject"
              value={note.subject}
              onChange={handleChange}
              placeholder="e.g. Biology"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Tags (comma-separated)</label>
            <input
              name="tags"
              value={note.tags}
              onChange={handleChange}
              placeholder="e.g. cells, DNA, genetics"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Content</label>
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              placeholder="Write your note content here..."
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2 rounded hover:bg-blue-700 transition font-medium cursor-pointer"
          >
            ➕ Create Note
          </button>
        </form>
      </div>
    </div>
  );
}
