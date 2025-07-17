import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { QuizResult } from "../models/quizResult.model.js";  
import { StudySchedule } from "../models/studySchedule.model.js";
import { FlashcardReview } from "../models/flashcardReview.model.js";

export const getUserProgress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Quiz Results
  const quizResults = await QuizResult.find({ user: userId });
  const totalQuizzes = quizResults.length;
  const totalScore = quizResults.reduce((sum, q) => sum + (q.score || 0), 0);
  const maxScore = quizResults.reduce((sum, q) => sum + (q.questions?.length || 0), 0);
  const avgScore = maxScore > 0 ? (totalScore / totalQuizzes) : 0;


  // 2. Study Reminders
  const reminders = await StudySchedule.find({ user: userId });
  const totalReminders = reminders.length;
  const completed = reminders.filter(r => r.status === "completed").length;
  const skipped = reminders.filter(r => r.status === "skipped").length;

  // 3. Flashcard Reviews
  const flashcardReviews = await FlashcardReview.find({ user: userId });
  const totalFlashcardReviews = flashcardReviews.length;

  res.status(200).json(
    new ApiResponse(200, {
      quizzes: {
        totalQuizzes,
        avgScore: avgScore.toFixed(2),
      },
      reminders: {
        totalReminders,
        completed,
        skipped,
        pending: totalReminders - completed - skipped,
      },
      flashcards: {
        totalFlashcardReviews,
      }
    }, "User progress fetched")
  );
});

export const logFlashcardReview = asyncHandler(async (req, res) => {
  const { flashcardId } = req.body;
  if (!flashcardId) return res.status(400).json({ message: "Flashcard ID is required" });

  const review = await FlashcardReview.create({
    user: req.user._id,
    flashcardId
  });

  res.status(201).json(new ApiResponse(201, review, "Flashcard review logged"));
});

