import mongoose from "mongoose";

const flashcardReviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flashcardId: { type: mongoose.Schema.Types.ObjectId, ref: "Flashcard", required: true },
  reviewedAt: { type: Date, default: Date.now }
});

export const FlashcardReview = mongoose.model("FlashcardReview", flashcardReviewSchema);
