import { StudySchedule } from "../models/studySchedule.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create reminder (can be called manually or automatically)
export const createStudyReminder = asyncHandler(async (req, res) => {
  const { noteId, suggestedDate, reason } = req.body;

  const reminder = await StudySchedule.create({
    user: req.user._id,
    noteId,
    suggestedDate,
    reason,
  });

  res.status(201).json(new ApiResponse(201, reminder, "Study reminder created"));
});

// Get all upcoming reminders
export const getStudyReminders = asyncHandler(async (req, res) => {
  const reminders = await StudySchedule.find({ user: req.user._id })
    .populate("noteId", "title")
    .sort({ suggestedDate: 1 });

  res.status(200).json(new ApiResponse(200, reminders, "Reminders fetched"));
});

// Update status (completed/skipped)
export const updateReminderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatus = ["pending", "completed", "skipped"];
  if (!validStatus.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const updated = await StudySchedule.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { status },
    { new: true }
  );

  if (!updated) throw new ApiError(404, "Reminder not found");

  res.status(200).json(new ApiResponse(200, updated, "Reminder status updated"));
});
