import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";

export default function CreateReminderForm({ onReminderCreated }) {
  const [notes, setNotes] = useState([]);
  const [noteId, setNoteId] = useState("");
  const [suggestedDate, setSuggestedDate] = useState("");
  const [loadingNotes, setLoadingNotes] = useState(true);

  /* ────────────────────────────────
     1️⃣  Load all notes for dropdown
  ───────────────────────────────────*/
  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest({
          method: endpoints.getNotes.method,
          url: endpoints.getNotes.url,
        });
        setNotes(res?.data || res);
      } catch (err) {
        toast.error("Failed to load notes");
        console.error(err);
      } finally {
        setLoadingNotes(false);
      }
    })();
  }, []);

  /* ────────────────────────────────
     2️⃣  Submit handler
  ───────────────────────────────────*/
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteId || !suggestedDate) {
      return toast.error("Both note and date are required");
    }

    try {
      const { method, url } = endpoints.reminders.create;
      await apiRequest({ method, url, data: { noteId, suggestedDate } });
      toast.success("Reminder created!");
      onReminderCreated();           // refresh list in parent
      setNoteId("");
      setSuggestedDate("");
    } catch (err) {
      toast.error("Failed to create reminder");
      console.error(err);
    }
  };

  /* ────────────────────────────────
     3️⃣  JSX
  ───────────────────────────────────*/
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 p-4 rounded shadow mb-6 text-white space-y-4"
    >
      <h2 className="text-xl font-semibold">Create New Reminder</h2>

      {/* Note selector */}
      <div>
        <label className="block text-sm mb-1">Select Note</label>
        <select
          value={noteId}
          disabled={loadingNotes}
          onChange={(e) => setNoteId(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="" disabled>
            {loadingNotes ? "Loading notes..." : "Choose a note"}
          </option>
          {notes.map((note) => (
            <option key={note._id} value={note._id}>
              {note.title} {note.subject ? `(${note.subject})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Date picker */}
      <div>
        <label className="block text-sm mb-1">Suggested Date</label>
        <input
          type="date"
          value={suggestedDate}
          onChange={(e) => setSuggestedDate(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
        disabled={loadingNotes}
      >
        Create Reminder
      </button>
    </form>
  );
}
