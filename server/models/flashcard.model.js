import mongoose from "mongoose";
const flashcardSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: "Note" },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  subject: { type: String },
  tags: [String]
}, { timestamps: true });

flashcardSchema.index({ question: "text", answer: "text", subject: "text" });
flashcardSchema.index({ tags: 1 });
export const Flashcard = mongoose.model("Flashcard", flashcardSchema);