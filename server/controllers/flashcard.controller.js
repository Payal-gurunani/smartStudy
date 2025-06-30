import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Smart Study Assistant"
  }
});

export const generateFlashcardsFromNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const note = await Note.findOne({ _id: id, user: req.user._id });
  if (!note || !note.content) {
    throw new ApiError(404, "Note not found or content is missing");
  }

  const prompt = `
You are a flashcard generator. From the following study content, extract 8–10 important flashcards in this format:

[
  {
    "question": "What is ...?",
    "answer": "..."
  },
  ...
]

Return only valid JSON.

CONTENT:
${note.content}
  `;

  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let flashcards;
  try {
    flashcards = JSON.parse(completion.choices[0].message.content);
  } catch (error) {
    throw new ApiError(500, "Failed to parse flashcard JSON. Try again.");
  }

  note.flashcards = flashcards;
  await note.save();

  res.status(200).json(new ApiResponse(200, flashcards, "Flashcards generated successfully"));
});

export const summarizeNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findOne({ _id: id, user: req.user._id });

  if (!note || !note.content) {
    throw new ApiError(404, "Note not found or empty");
  }

  const prompt = `
You are a helpful study assistant. Summarize the following note content into concise bullet points or a short paragraph for quick revision. Be accurate and clear.

CONTENT:
${note.content}
`;

  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const summary = completion.choices[0].message.content;

  // Save to note
  note.summary = summary;
  await note.save();

  res.status(200).json(new ApiResponse(200, summary, "Summary generated successfully"));
});
