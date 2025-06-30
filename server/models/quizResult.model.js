import mongoose from "mongoose";

const quizResultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note", required: true },
  questions: [
    {
      question: String,
      options: [String],
      correctAnswer: String,
      selectedAnswer: String,
      isCorrect: Boolean,
    }
  ],
  score: Number, 
  attemptedAt: { type: Date, default: Date.now },
});

export const QuizResult = mongoose.model("QuizResult", quizResultSchema);
