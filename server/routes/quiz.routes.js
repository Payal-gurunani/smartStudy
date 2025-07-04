import { Router } from "express";
import {
  generateQuizFromNote,
  submitQuiz,
  getUserQuizResults,
  getQuizResultById,
  getAllQuizStatus,
  getQuizByNoteId
} from "../controllers/quizGenrator.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = Router();
router.use(isAuthenticated);

router.route("/from-note/:noteId").post(generateQuizFromNote);

router.route("/submit").post(submitQuiz);

router.route("/quiz-results").get(getUserQuizResults);
router.route("/result/:id").get(getQuizResultById);
router.route("/all-status").get(getAllQuizStatus); 
router.route("/by-note/:noteId").get(getQuizByNoteId);

export default router;
