import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [note, setNote] = useState(null);
  const [summary, setSummary] = useState("");
  const [mobileActionsOpen, setMobileActionsOpen] = useState(false);
const location = useLocation();
  const fetchNote = async () => {
    try {
      const { method, url } = endpoints.getNote(id);
      const res = await apiRequest({ method, url });
      const noteData = res?.note || res?.data || res;
      setNote(noteData);
      if (noteData.summary) setSummary(noteData.summary);
    } catch (err) {
      console.error("Failed to load note", err);
      toast.error("Unable to load note");
    }
  };

  const handleSummarize = async () => {
    const toastId = toast.loading("Generating summary...");
    try {
      const { method, url } = endpoints.summarizeNote(id);
      const res = await apiRequest({ method, url });
      const newSummary =
        typeof res === "string" ? res : res?.summary || res?.data?.summary;

      if (!newSummary) throw new Error("No summary returned");

      setSummary(newSummary);
      toast.update(toastId, {
        render: "✅ Summary generated!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      console.error("Summarize failed", error);
      toast.update(toastId, {
        render: "❌ Failed to summarize",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
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

  const ActionButtons = ({ vertical = false }) => (
    <div className={`flex ${vertical ? "flex-col" : "flex-wrap"} gap-6`}>
      <Link
  to={`/notes/${note._id}/quiz/generate`}
  state={{ from: location.pathname }} // ✅ Pass current page
  className="btn-primary cursor-pointer"
>
  Generate Quiz
</Link>

      <button onClick={handleSummarize} className="btn-primary cursor-pointer">
        {summary ? "Re-Summarize" : "Summarize"}
      </button>
      <Link to={`/notes/edit/${note._id}`} className="btn-secondary cursor-pointer">
        Edit
      </Link>
      <button onClick={handleDelete} className="btn-danger cursor-pointer">
        Delete
      </button>
      
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 text-white px-4 py-6 sm:px-6 sm:py-12 relative">
      {/* 🔵 Mobile Action Toggle Button */}
      <div className="sm:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setMobileActionsOpen(!mobileActionsOpen)}
          className="bg-blue-600 text-white rounded px-4 py-2 shadow hover:bg-blue-700"
        >
          ☰ Actions
        </button>
      </div>

      {/* 🔵 Mobile Actions Sidebar */}
      {mobileActionsOpen && (
        <div className="sm:hidden fixed top-16 right-4 w-72 bg-slate-800 p-4 rounded-xl shadow-lg z-40 border border-slate-600">
          <ActionButtons vertical />
        </div>
      )}

      {/* 🟢 Main Note Display */}
      
      <div className="max-w-3xl mx-auto bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg">

  {/* 🔙 Back Button */}
  <div className="mb-4">
    <Link
      to="/notes"
      className="btn-secondary w-full sm:w-auto text-center block sm:inline-block"
    >
      ⬅ Back to All Notes
    </Link>
    <div className="hidden sm:flex">
      <ActionButtons />
    </div>
  </div>

  {/* 🖥️ Title + Desktop Buttons */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold break-words">{note.title}</h1>
      <p className="text-sm text-slate-400 break-words">{note.subject}</p>
      <p className="text-sm italic text-slate-300 break-words">
        {note.tags?.join(", ")}
      </p>
    </div>

    {/* 🟢 Desktop Buttons (Right Side) */}
    
  </div>

  {/* 📝 Content */}
  <div className="text-slate-200 whitespace-pre-wrap break-words mb-6">
    {note.content}
  </div>

  {/* 📌 Summary */}
  {summary && (
    <div className="relative bg-slate-700 p-4 rounded mb-6 border border-slate-600">
      <button
        onClick={() => setSummary("")}
        className="absolute top-2 right-3 text-slate-400 hover:text-red-400 text-xl"
        title="Remove summary"
      >
        ×
      </button>
      <h3 className="text-lg font-semibold mb-2 text-green-300">Summary</h3>
      <p className="text-slate-100 whitespace-pre-wrap break-words">{summary}</p>
    </div>
  )}
</div>

    </div>
  );
}
