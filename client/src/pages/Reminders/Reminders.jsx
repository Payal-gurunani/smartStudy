import { useEffect, useState } from "react";
import { apiRequest } from "../../api/apiRequest";
import { endpoints } from "../../api/endPoints";
import ReminderCard from "../../components/ReminderCard";
import { method } from "lodash";
import CreateReminderForm from "./CreateReminderForm";
export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    try {
      const data = await apiRequest({
        method: endpoints.reminders.getAll.method,
        url: endpoints.reminders.getAll.url,
      });
      
      setReminders(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching reminders", error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const { method, url } = endpoints.reminders.updateStatus(id);
      await apiRequest({ method, url, data: { status } });
      fetchReminders();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { method, url } = endpoints.reminders.delete(id);
      await apiRequest({ method, url });
      fetchReminders();
    } catch (err) {
      console.error("Failed to delete reminder", err);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Your Upcoming Study Reminders</h1>
      <CreateReminderForm onReminderCreated={fetchReminders} />

      {loading ? (
        <p>Loading reminders...</p>
      ) : reminders.length === 0 ? (
        <p>No upcoming reminders.</p>
      ) : (
        reminders.map((reminder) => (
          <ReminderCard
            key={reminder._id}
            reminder={reminder}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))
      )}
    </div>
  );
}
