import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

export default function CreateReminderForm({ onReminderCreated }) {
  const [notes, setNotes]   = useState([]);
  const [noteId, setNoteId] = useState("");
  const [date, setDate]     = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiRequest(endpoints.getNotes);
        setNotes( res);
        console.log(res);
        
      } catch {
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noteId || !date) return toast.error("Both note and date are required");

    try {
      await apiRequest({
        ...endpoints.reminders.create,
        data: { noteId, suggestedDate: date },
      });
      toast.success("Reminder created!");
      onReminderCreated();
      setNoteId("");
      setDate("");
    } catch {
      toast.error("Failed to create reminder");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-800 rounded-2xl p-6 mb-8 space-y-5 ring-1 ring-white/10"
    >
      <h2 className="text-lg font-semibold">Create New Reminder</h2>

      <div className="space-y-1">
        <label className="text-sm">Select Note</label>
        <select
          value={noteId}
          disabled={loading}
          onChange={(e) => setNoteId(e.target.value)}
          className="w-full rounded-lg bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {loading ? "Loading notes…" : "Choose a note"}
          </option>
          {notes.map(({ _id, title, subject }) => (
            <option key={_id} value={_id}>
              {title} {subject && `(${subject})`}
            </option>
          ))}
        </select>
      </div>

      {/* Date picker */}
      <div className="space-y-1">
        <label className="text-sm">Suggested Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg bg-gray-700 px-3 py-2 focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading && <Loader2 className="w-4 h-4 animate-spin" />} Create Reminder
      </button>
    </form>
  );
}
