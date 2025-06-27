import {Note} from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import pdfParse from "pdf-parse";
import cloudinary from "../utils/cloudinary.js"; // ✅ import

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


export const uploadPdfNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No PDF file uploaded");
  }

  const pdfBuffer = req.file.buffer; // ✅ use buffer directly
  const pdfData = await pdfParse(pdfBuffer);
console.log("Extracted Text:", pdfData.text.slice(0, 500)); // Preview first 500 chars


  const { subject, tags = [] } = req.body;

  const note = await Note.create({
    title: req.file.originalname,
    content: pdfData.text,
    subject,
    tags,
    user: req.user._id,
    isPdf: true,
    pdfPath: "in-memory", // Or leave null if not storing
  });

  res.status(201).json(new ApiResponse(201, note, "PDF note uploaded"));
});
