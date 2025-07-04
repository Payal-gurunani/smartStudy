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
  const { noteId } = req.params;

  // Step 1: Validate note existence and content
  const note = await Note.findOne({ _id: noteId, user: req.user._id });
  if (!note || !note.content) {
    throw new ApiError(404, "Note not found or no content available");
  }

  const numberOfQuestions = parseInt(req.query.count) || 5;

  // Step 2: Build proper prompt
  const prompt = `
You are a quiz generator. Generate ${numberOfQuestions} multiple-choice questions from the following content.

Each question must have 4 options labeled "A", "B", "C", and "D".

Return ONLY valid JSON in this format:
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
  }
]

CONTENT:
${note.content}
`;

  // Step 3: Generate quiz via OpenRouter/OpenAI
  const completion = await openai.chat.completions.create({
    model: "mistralai/mistral-7b-instruct",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  let quiz;
  let raw = completion.choices[0].message.content;

  // console.log("🔍 Raw AI response:\n", raw); // log once

  // Step 4: Clean up response
  raw = raw.trim().replace(/^```json/, "").replace(/^```/, "").replace(/```$/, "");

  // Step 5: Try parsing
  try {
    quiz = JSON.parse(raw);
  } catch (err) {
    console.error("❌ Failed to parse quiz:", raw);
    throw new ApiError(500, "Quiz parsing failed");
  }

  // Step 6: Optional: Validate quiz format
  if (!Array.isArray(quiz) || !quiz[0]?.question || !quiz[0]?.options || !quiz[0]?.answer) {
    throw new ApiError(500, "Invalid quiz structure returned by AI");
  }

  // Step 7: Save quiz to DB
  await Note.updateOne({ _id: noteId, user: req.user._id }, { $set: { quiz } });

  res.status(200).json(new ApiResponse(200, quiz, "Quiz generated successfully"));
});

// SUBMIT QUIZ
export const submitQuiz = asyncHandler(async (req, res) => {
  const { noteId, answers } = req.body;
  const note = await Note.findOne({ _id: noteId, user: req.user._id });
  if (!note) throw new ApiError(404, "Note not found");

  const quiz = note.quiz;
  if (!quiz || quiz.length === 0) {
    throw new ApiError(400, "Quiz not found. Please generate it first.");
  }

  let correct = 0;
  const evaluated = quiz.map((q, i) => {
    const selected = answers[i]?.selectedAnswer; // "A", "B", etc.
    const isCorrect = selected === q.answer;

    if (isCorrect) correct++;

    return {
      question: q.question,
      options: q.options,
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
  const results = await QuizResult.find({ user: req.user._id })
    .populate('noteId', 'title') // just get the note's title
    .sort({ createdAt: -1 }); // use timestamps for sorting

  const detailedResults = results.map(result => {
    const correctCount = result.questions.filter(q => q.isCorrect).length;
    const totalQuestions = result.questions.length;

    return {
      _id: result._id,
      title: result.noteId?.title || "Untitled",
      score: result.score,
      correct: correctCount,
      total: totalQuestions,
      attemptedAt: result.attemptedAt,
      questions: result.questions, // optional: can remove if not needed
    };
  });

  res.status(200).json(new ApiResponse(200, detailedResults, "Quiz results fetched"));
});

export const getQuizResultById = asyncHandler(async (req, res) => {
  const result = await QuizResult.findOne({ _id: req.params.id, user: req.user._id })
    .populate("noteId", "title");

  if (!result) throw new ApiError(404, "Quiz result not found");


  res.status(200).json(new ApiResponse(200, result, "Quiz result fetched"));
});


export const getAllQuizStatus = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const notes = await Note.find({ user: userId });

  const quizResults = await QuizResult.find({ user: userId });

  const status = notes.map((note) => {
    const attempts = quizResults.filter(r => r.noteId.toString() === note._id.toString());
    const lastAttempt = attempts.sort((a, b) => new Date(b.attemptedAt) - new Date(a.attemptedAt))[0];

    return {
      noteId: note._id,
      title: note.title,
      attempted: attempts.length > 0,
      lastScore: lastAttempt?.score || null,
      lastAttemptedAt: lastAttempt?.attemptedAt || null,
      resultId: lastAttempt?._id || null,
    };
  });

  res.status(200).json(new ApiResponse(200, status, "Quiz status fetched"));
});

export const getQuizByNoteId = asyncHandler(async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findOne({ _id: noteId, user: req.user._id });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  if (!note.quiz || note.quiz.length === 0) {
    throw new ApiError(404, "Quiz not generated yet for this note");
  }

  res.status(200).json(new ApiResponse(200, note.quiz, "Quiz fetched successfully"));
});
