import { StudySchedule } from "../models/studySchedule.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// Create reminder (can be called manually or automatically)
export const createStudyReminder = asyncHandler(async (req, res) => {
  const { noteId, suggestedDate, reason } = req.body;
 if (!noteId || !suggestedDate) {
    throw new ApiError(400, "Note and suggestedDate are required");
  }
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
  const filter = { user: req.user._id };

  // Optional query to only show future/pending reminders
  if (req.query.upcoming === "true") {
    filter.suggestedDate = { $gte: new Date() };
    filter.status = "pending";
  }

  const reminders = await StudySchedule.find(filter)
    .populate("noteId", "title")
    .sort({ suggestedDate: 1 });

  res
    .status(200)
    .json(new ApiResponse(200, reminders, "Study reminders fetched successfully"));
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

export const deleteStudyReminder = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await StudySchedule.findOneAndDelete({
    _id: id,
    user: req.user._id,
  });

  if (!deleted) throw new ApiError(404, "Reminder not found");

  res
    .status(200)
    .json(new ApiResponse(200, deleted, "Reminder deleted successfully"));
});
