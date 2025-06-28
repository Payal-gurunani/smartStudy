import {Note} from "../models/note.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import fs from "fs";
import pdfParse from "pdf-parse";
import cloudinary from "../utils/cloudinary.js"; // ✅ import
import OpenAI from "openai";
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
export const uploadPdfNote = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No PDF file uploaded");
  }

  const pdfBuffer = req.file.buffer; // ✅ use buffer directly
  const pdfData = await pdfParse(pdfBuffer);
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


//Quiz

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY, 
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", 
    "X-Title": "Smart Study Assistant"
  }
});


export const generateQuizFromNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({ _id: id, user: req.user._id });
  if (!note || !note.content) {
    throw new ApiError(404, "Note not found or no content available");
  }

  const prompt = `
You are a quiz generator. Generate 5 multiple-choice questions from the following content.

Return only JSON in this format:
[
  {
    "question": "...?",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  },
  ...
]

CONTENT:
${note.content}
`;

  const completion = await openai.chat.completions.create({
  model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let quiz;
  try {
    quiz = JSON.parse(completion.choices[0].message.content);
  } catch (error) {
  if (error.status === 500) {
    throw new ApiError(500, "OpenAI quota exceeded. Please check billing.");
  }
  throw new ApiError(500, "Quiz generation failed");
}


  res.status(200).json(new ApiResponse(200, quiz, "Quiz generated successfully"));
});


