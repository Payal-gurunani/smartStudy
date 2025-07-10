import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";

export default function NoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [note, setNote] = useState(null);
  const [summary, setSummary] = useState("");
  const [generatingFlashcards, setGeneratingFlashcards] = useState(false);

  useEffect(() => {
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

    fetchNote();
  }, [id]);

  const handleSummarize = async () => {
    const toastId = toast.loading("Generating summary...");
    try {
      const { method, url } = endpoints.summarizeNote(id);
      const res = await apiRequest({ method, url });
      const newSummary = typeof res === "string" ? res : res?.summary || res?.data?.summary;
      if (!newSummary) throw new Error("No summary returned");
      setSummary(newSummary);
      toast.update(toastId, {
        render: "Summary generated!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        render: "Failed to summarize",
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
      navigate("/notes/view");
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (!note) return <div className="text-white p-8">Loading note...</div>;

  return (
    <div className="min-h-screen w-full bg-black text-white flex sm:flex-row flex-col overflow-x-hidden">
   
      <aside className="hidden sm:flex flex-col gap-4 w-64 p-6 bg-neutral-900 border-r border-gray-800 fixed top-16 left-0 h-[calc(100vh-4rem)] z-40">
        <h2 className="text-xl font-semibold mb-4">Actions</h2>

        <Link
          to={`/notes/${note._id}/quiz/generate`}
          state={{ from: location.pathname }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center transition"
        >
          Generate Quiz
        </Link>

        <button
          onClick={handleSummarize}
          className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
        >
          {summary ? "Re-Summarize" : "Summarize"}
        </button>

        <button
          disabled={generatingFlashcards}
          onClick={async () => {
            setGeneratingFlashcards(true);
            const toastId = toast.loading("Generating flashcards...");
            try {
              await apiRequest(endpoints.generateFlashcards(note._id));
              toast.update(toastId, {
                render: "Flashcards generated!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
            } catch {
              toast.update(toastId, {
                render: "Failed to generate flashcards.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
            } finally {
              setGeneratingFlashcards(false);
            }
          }}
          className={`${
            generatingFlashcards ? "bg-gray-600 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
          } text-white px-4 py-2 rounded-md text-sm font-medium transition cursor-pointer`}
        >
          {generatingFlashcards ? "Generating..." : "Generate Flashcards"}
        </button>
      </aside>

      
      <main className="flex-1 sm:ml-64 px-4 py-10 sm:px-8 overflow-x-auto">
        <div className="flex justify-end mb-6">
          <button
            onClick={() => navigate("/notes/view")}
            className="bg-white/10 hover:bg-white/20 text-sm text-white px-4 py-2 rounded-full transition cursor-pointer"
          >
            Back
          </button>
        </div>

        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 break-words">{note.title}</h1>
              <p className="text-sm text-gray-400 break-words">{note.subject}</p>
              <p className="text-sm italic text-gray-500 break-words">{note.tags?.join(", ")}</p>
            </div>

            <div className="flex gap-4 text-xl text-gray-400">
              <Link
                to={`/notes/edit/${note._id}`}
                title="Edit"
                className="hover:text-blue-400 transition"
              >
                ✏️
              </Link>
              <button
                onClick={handleDelete}
                title="Delete"
                className="hover:text-red-400 transition cursor-pointer"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words mb-8">
          {note.content}
        </div>

        {summary && (
          <div className="relative bg-gray-800/70 p-4 rounded-lg mb-6 border border-gray-700">
            <button
              onClick={() => setSummary("")}
              className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl"
              title="Remove summary"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold text-green-400 mb-2">Summary</h3>
            <p className="text-gray-100 whitespace-pre-wrap">{summary}</p>
          </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-neutral-800 border-t border-gray-700 px-4 py-3 flex justify-around z-50">
        <button
          onClick={() => navigate(`/notes/${note._id}/quiz/generate`, {
            state: { from: location.pathname },
          })}
          className="text-sm text-white bg-blue-600 px-3 py-2 rounded-md"
        >
          Quiz
        </button>
        <button
          onClick={handleSummarize}
          className="text-sm text-white bg-purple-600 px-3 py-2 rounded-md"
        >
          {summary ? "Re-Sum" : "Sum"}
        </button>
        <button
          disabled={generatingFlashcards}
          onClick={async () => {
            setGeneratingFlashcards(true);
            const toastId = toast.loading("Generating flashcards...");
            try {
              await apiRequest(endpoints.generateFlashcards(note._id));
              toast.update(toastId, {
                render: "Flashcards generated!",
                type: "success",
                isLoading: false,
                autoClose: 3000,
              });
            } catch {
              toast.update(toastId, {
                render: "Failed to generate flashcards.",
                type: "error",
                isLoading: false,
                autoClose: 3000,
              });
            } finally {
              setGeneratingFlashcards(false);
            }
          }}
          className={`${
            generatingFlashcards ? "bg-gray-600 cursor-not-allowed" : "bg-teal-600"
          } text-sm text-white px-3 py-2 rounded-md`}
        >
          {generatingFlashcards ? "..." : "Flashcards"}
        </button>
      </div>
    </div>
  );
}
