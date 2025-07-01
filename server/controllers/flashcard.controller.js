import { Note } from "../models/note.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import OpenAI from "openai";
import { Flashcard } from "../models/flashcard.model.js";
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
let tags = [];

try {
  if (Array.isArray(note.tags)) {
    // Handles cases like: ['["Optics", "Light"]']
    if (
      note.tags.length === 1 &&
      typeof note.tags[0] === "string" &&
      note.tags[0].trim().startsWith("[") &&
      note.tags[0].trim().endsWith("]")
    ) {
      const parsed = JSON.parse(note.tags[0]);
      tags = Array.isArray(parsed) ? parsed : [];
    } else {
      tags = note.tags;
    }
  } else if (typeof note.tags === "string") {
    const parsed = JSON.parse(note.tags);
    tags = Array.isArray(parsed) ? parsed : [];
  }
} catch (err) {
  tags = [];
}




const flashcardsToSave = flashcards.map(f => ({
  user: req.user._id,
  noteId: note._id,
  question: f.question,
  answer: f.answer,
  subject: note.subject,
  tags: tags 
}));

await Flashcard.insertMany(flashcardsToSave);


await Flashcard.insertMany(flashcardsToSave);


  res.status(200).json(new ApiResponse(200, flashcards, "Flashcards generated successfully"));
});


export const searchFlashcards = asyncHandler(async (req, res) => {
  const { query, subject, tag } = req.query;

  const filter = { user: req.user._id };
  if (subject) filter.subject = subject;
  if (tag) filter.tags = tag;
  if (query) filter.$text = { $search: query };

  const flashcards = await Flashcard.find(filter).sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, flashcards, "Flashcards fetched"));
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

