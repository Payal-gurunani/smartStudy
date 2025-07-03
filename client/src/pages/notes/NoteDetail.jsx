import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);

  const fetchNote = async () => {
    try {
      const { method, url } = endpoints.getNote(id);
      const res = await apiRequest({ method, url });
      setNote(res?.note || res?.data || res);
    } catch (err) {
      console.error("Failed to load note", err);
      toast.error("Unable to load note");
    }
  };

  const handleSummarize = async () => {
    try {
      const { method, url } = endpoints.summarizeNote(id);
      const res = await apiRequest({ method, url });
      const summary = typeof res === "string" ? res : res?.summary || res?.data?.summary;

      if (!summary) throw new Error("No summary returned");

      toast.info("📌 Summary: " + summary, { autoClose: 8000 });
    } catch (error) {
      console.error("Summarize failed", error);
      toast.error("Failed to summarize");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;
    try {
      const { method, url } = endpoints.deleteNote(id);
      await apiRequest({ method, url });
      toast.success("Note deleted");
      navigate("/notes");
    } catch (error) {
      console.error("Delete failed", error);
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchNote();
  }, [id]);

  if (!note) return <div className="text-white p-8">Loading note...</div>;

  return (
    <div className="min-h-screen bg-slate-900 text-white px-6 py-12">
      <div className="max-w-3xl mx-auto bg-slate-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-2">{note.title}</h1>
        <p className="text-sm text-slate-400 mb-1">{note.subject}</p>
        <p className="text-sm italic mb-4 text-slate-300">{note.tags?.join(", ")}</p>
        <p className="whitespace-pre-wrap text-slate-200 mb-6">{note.content}</p>

        <div className="flex flex-wrap gap-3">
          <button onClick={handleSummarize} className="btn-primary">Summarize</button>
          <Link to={`/notes/edit/${note._id}`} className="btn-secondary">Edit</Link>
          <button onClick={handleDelete} className="btn-danger">Delete</button>
          <Link to="/notes" className="btn-secondary">⬅ Back to All Notes</Link>
        </div>
      </div>
    </div>
  );
}
