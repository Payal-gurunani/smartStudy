// src/pages/reminders/Reminders.jsx
import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import ReminderCard from "../../components/ReminderCard";
import Sidebar from "../../components/Sidebar";
import { FiMenu } from "react-icons/fi";
import { Loader2 } from "lucide-react";
import { confirmToast } from "../../utils/confirmToast";   // ⬅️ toast dialog
import CreateReminderForm from "./CreateReminderForm";
export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  /* ── Fetch all reminders ── */
  const fetchReminders = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(endpoints.reminders.getAll);
      setReminders(data);
    } catch {
      /* eslint-disable-next-line no-console */
      console.error("Failed to fetch reminders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReminders(); }, []);

  /* ── Status change ── */
  const handleStatusChange = async (id, status) => {
    try {
      await apiRequest({ ...endpoints.reminders.updateStatus(id), data: { status } });
      fetchReminders();
    } catch { console.error("Failed to update status"); }
  };

  /* ── Delete with confirmation ── */
  const handleDelete = async (id) => {
    const ok = await confirmToast({
      title: "Delete reminder?",
      message: "This cannot be undone.",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;

    try {
      await apiRequest(endpoints.reminders.delete(id));
      fetchReminders();
    } catch { console.error("Failed to delete"); }
  };

  /* ── JSX ── */
  return (
    <div className="flex bg-slate-900 min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main */}
      <main className="flex-1 w-full px-4 py-6 sm:px-10 sm:py-10 sm:ml-60">
        <div className="mx-auto max-w-3xl">
          {/* Mobile bar */}
          <div className="sm:hidden flex justify-between items-center mb-6">
            <button onClick={() => setIsSidebarOpen(true)}>
              <FiMenu className="text-2xl text-white" />
            </button>
            <h1 className="text-lg font-semibold">Study Reminders</h1>
          </div>

          {/* Heading (desktop) */}
          <h1 className="hidden sm:block text-2xl font-bold mb-6">
            Your Upcoming Study Reminders
          </h1>

          {/* Create form */}
          <CreateReminderForm onReminderCreated={fetchReminders} />

          {/* List / states */}
          {loading ? (
            <div className="grid h-[40vh] place-items-center">
              <span className="flex items-center gap-2 text-white/80">
                <Loader2 className="w-6 h-6 animate-spin" /> Loading…
              </span>
            </div>
          ) : reminders.length === 0 ? (
            <p className="text-white/60 text-center">🎉 No upcoming reminders.</p>
          ) : (
            reminders.map((rem) => (
              <ReminderCard
                key={rem._id}
                reminder={rem}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </main>
    </div>
  );
}
