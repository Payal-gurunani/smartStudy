import {Note} from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { generateQuizFromNote,getUserQuizResults,submitQuiz } from "./quizGenrator.controller.js";
import { uploadPdfNote } from "./uploadpdf.controller.js";


// CREATE
export const createNote = asyncHandler(async (req, res) => {
  const { title, content, tags, subject } = req.body;
  const note = await Note.create({ user: req.user._id, title, content, tags, subject });
  res.status(201).json(new ApiResponse(201, note, "Note created"));
});

// GET ALL (with filter)
export const getAllNotes = asyncHandler(async (req, res) => {
  const { tag, subject } = req.query;

  const filter = { user: req.user._id };
  if (tag) filter.tags = tag;
  if (subject) filter.subject = subject;

  const notes = await Note.find(filter).sort({ updatedAt: -1 });
  res.status(200).json(new ApiResponse(200, notes, "Notes fetched"));
});

// UPDATE
export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, content, tags, subject } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: id, user: req.user._id },
    { title, content, tags, subject },
    { new: true }
  );

  if (!note) throw new ApiError(404, "Note not found or unauthorized");

  res.status(200).json(new ApiResponse(200, note, "Note updated"));
});

// DELETE
export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deleted = await Note.findOneAndDelete({ _id: id, user: req.user._id });
  if (!deleted) throw new ApiError(404, "Note not found or unauthorized");

  res.status(200).json(new ApiResponse(200, {}, "Note deleted"));
});

//Upload PDF Note
export{uploadPdfNote,
  //Quiz Generation and results
  generateQuizFromNote,
  submitQuiz,
  getUserQuizResults
}
