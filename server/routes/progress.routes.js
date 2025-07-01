import { Router } from "express";
const router = Router();
import { getUserProgress ,logFlashcardReview } from "../controllers/progress.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
router.use(isAuthenticated);
router.route("/").get(getUserProgress);
router.route("/flashcard-review").post(logFlashcardReview);

export default router;