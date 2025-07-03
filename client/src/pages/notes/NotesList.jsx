import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

export default function NotesList() {
  const [notes, setNotes] = useState([]);

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
  const handleSummarizeNote = async (id) => {
    try {
      const { method, url } = endpoints.summarizeNote(id);
      const res = await apiRequest({ method, url });

      const summary = typeof res === "string" ? res : res?.summary || res?.data?.summary;

      if (!summary) throw new Error("No summary returned");

      toast.info("📌 Summary: " + summary, { autoClose: 8000 });
    } catch (error) {
      console.error("Summarization error:", error);
      toast.error("Failed to summarize note.");
    }
  };

  const deleteNote = async (id) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const { method, url } = endpoints.deleteNote(id);
      await apiRequest({ method, url });
      toast.success("Note deleted");
      fetchNotes();
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">📝 Your Notes</h2>
          <div className="space-x-3">
            <Link to="/notes/create" className="btn-primary">+ Create more notes?</Link>
            <Link to="/notes/upload" className="btn-secondary">+Upload PDF for notes?</Link>

          </div>
        </div>

        {notes.length === 0 ? (
          <p className="text-slate-400">No notes found.</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1 },
              },
            }}
          >
            {notes.map((note) => (
              <motion.div
                key={note._id}
                className="bg-white/10 backdrop-blur-lg border border-white/10 rounded-xl p-5 shadow-lg hover:shadow-blue-500/20 transition-all duration-200 flex flex-col justify-between"
                whileHover={{ scale: 1.02 }}
              >
                <div>
                  <Link to={`/notes/${note._id}`} className="text-xl font-semibold mb-1 line-clamp-2 hover:underline">
                    {note.title}
                  </Link>
                  <p className="text-sm text-slate-300 mb-1">{note.subject}</p>
                  <p className="text-sm text-slate-400 italic mb-3">
                    {note.tags?.join(", ")}
                  </p>
                  <p className="line-clamp-3 text-slate-200 text-sm">
                    {note.content?.slice(0, 120) || "No content..."}
                  </p>
                </div>

                <div className="flex justify-end items-center mt-4 space-x-2">
                  <Link to={`/notes/edit/${note._id}`} className="btn-secondary">Edit</Link>
                  <button onClick={() => deleteNote(note._id)} className="btn-danger">Delete</button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
