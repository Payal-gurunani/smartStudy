import cron from "node-cron";
import { StudySchedule } from "../models/studySchedule.model.js";

import dotenv from "dotenv";

// Load environment variables and DB connection
dotenv.config();

cron.schedule("*/5 * * * *", async () => {
  const now = new Date();
  const next5Min = new Date(now.getTime() + 5 * 60 * 1000);

  try {
    const upcomingReminders = await StudySchedule.find({
      suggestedDate: { $gte: now, $lte: next5Min },
      status: "pending"
    }).populate("noteId", "title");

    upcomingReminders.forEach((reminder) => {
      console.log(`[🔔 Reminder] Study '${reminder.noteId.title}' scheduled at ${reminder.suggestedDate}`);
    });

  } catch (error) {
    console.error("Cron Error:", error.message);
  }
});
