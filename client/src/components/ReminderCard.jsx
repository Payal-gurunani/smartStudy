export default function ReminderCard({ reminder, onStatusChange, onDelete }) {
  return (
    <div className="bg-gray-800 text-white rounded-lg p-4 shadow mb-4">
      <h3 className="text-lg font-semibold mb-1">{reminder.noteId?.title}</h3>
      <p className="text-sm text-gray-300">Date: {new Date(reminder.suggestedDate).toLocaleDateString()}</p>
      <p className="text-sm text-gray-400">Status: {reminder.status}</p>
      <div className="mt-3 flex gap-2">
        {reminder.status === "pending" && (
          <>
            <button onClick={() => onStatusChange(reminder._id, "completed")} className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded cursor-pointer">
              Mark Completed
            </button>
            <button onClick={() => onStatusChange(reminder._id, "skipped")} className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded cursor-pointer">
              Skip
            </button>
          </>
        )}
        <button onClick={() => onDelete(reminder._id)} className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded cursor-pointer">
          Delete
        </button>
      </div>
    </div>
  );
}
