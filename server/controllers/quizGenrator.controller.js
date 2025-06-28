import OpenAI from "openai";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { Note } from "../models/note.model.js";
import { QuizResult } from "../models/quizResult.model.js";

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

Each question must have 4 options labeled "A", "B", "C", and "D".

Return only valid JSON in this format:
[
  {
    "question": "What is ...?",
    "options": {
      "A": "Option A text",
      "B": "Option B text",
      "C": "Option C text",
      "D": "Option D text"
    },
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


// SUBMIT QUIZ
export const submitQuiz = asyncHandler(async (req, res) => {
  const { noteId, answers } = req.body;
  const note = await Note.findOne({ _id: noteId, user: req.user._id });
  if (!note) throw new ApiError(404, "Note not found");

  const prompt = `
Generate 5 MCQ quiz questions from the content below in this JSON format:
[
  {
    "question": "...",
    "options": ["A", "B", "C", "D"],
    "answer": "B"
  }
]
CONTENT:
${note.content}
`;

  const completion = await openai.chat.completions.create({
   model: "mistralai/mistral-7b-instruct",

    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const quiz = JSON.parse(completion.choices[0].message.content);
  let correct = 0;
const evaluated = quiz.map((q, i) => {
  const selected = answers[i]?.selectedAnswer; // "A", "B", etc.
  const isCorrect = selected === q.answer;

  if (isCorrect) correct++;

  return {
    question: q.question,
    options: q.options, // Object with A-D
    correctAnswer: q.answer,
    selectedAnswer: selected,
    isCorrect,
  };
});
if (evaluated.length !== quiz.length) {
    throw new ApiError(400, "Invalid number of answers provided");
  }


  const score = Math.round((correct / quiz.length) * 100);

  const result = await QuizResult.create({
    user: req.user._id,
    noteId,
    questions: evaluated,
    score,
  });

  res.status(200).json(new ApiResponse(200, result, "Quiz submitted and evaluated"));
});


export const getUserQuizResults = asyncHandler(async (req, res) => {
  const results = await QuizResult.find({ user: req.user._id }).sort({ attemptedAt: -1 });
  res.status(200).json(new ApiResponse(200, results, "Quiz results fetched"));
});
