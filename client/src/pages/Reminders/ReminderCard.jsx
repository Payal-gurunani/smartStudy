import { CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function ReminderCard({ reminder, onStatusChange, onDelete }) {
  const { _id, noteId, suggestedDate, reason, status } = reminder;

  const statusColor = {
    pending: "bg-yellow-500",
    completed: "bg-green-600",
    skipped: "bg-red-500",
  };

  return (
    <div className="bg-gray-800 p-5 rounded-xl mb-4 ring-1 ring-white/10 shadow-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">
          📘 {noteId?.title || "Untitled Note"}
        </h3>
        <span
          className={`text-xs px-3 py-1 rounded-full ${statusColor[status]} text-white`}
        >
          {status}
        </span>
      </div>

      <p className="text-sm text-white/70 mb-1">
        📅 {format(new Date(suggestedDate), "PPP")}
      </p>
      {reason && (
        <p className="text-sm text-white/60 italic mb-2">Reason: {reason}</p>
      )}

      <div className="flex gap-3 mt-3">
        {status === "pending" && (
          <>
            <button
              onClick={() => onStatusChange(_id, "completed")}
              className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm"
            >
              <CheckCircle className="w-4 h-4" /> Mark Completed
            </button>
            <button
              onClick={() => onStatusChange(_id, "skipped")}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm"
            >
              <XCircle className="w-4 h-4" /> Skip
            </button>
          </>
        )}
        <button
          onClick={() => onDelete(_id)}
          className="flex items-center gap-2 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm ml-auto"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
}
