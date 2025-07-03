import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";

export default function EditNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
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
        data: { ...note, tags: note.tags.split(",").map(tag => tag.trim()) },
      });
      toast.success("Note updated");
      navigate("/notes");
    } catch {
      toast.error("Update failed");
    }
  };

  if (!note) {
    return <p className="text-white p-6 bg-slate-900">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-10">
      <div className="max-w-xl mx-auto bg-white/10 p-6 rounded-xl shadow-lg border border-white/10">
        <h2 className="text-3xl font-bold mb-6 text-center">✏️ Edit Note</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm text-slate-300">Title</label>
            <input
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="e.g. Chemical Reactions"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Subject</label>
            <input
              name="subject"
              value={note.subject}
              onChange={handleChange}
              placeholder="e.g. Chemistry"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Tags (comma-separated)</label>
            <input
              name="tags"
              value={note.tags}
              onChange={handleChange}
              placeholder="e.g. reactions, acids, bases"
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm text-slate-300">Content</label>
            <textarea
              name="content"
              value={note.content}
              onChange={handleChange}
              placeholder="Edit your note content..."
              className="w-full px-3 py-2 bg-white/10 text-white rounded border border-white/20 h-40 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-yellow-600 py-2 rounded hover:bg-yellow-700 transition font-medium"
          >
            💾 Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
