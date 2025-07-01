import {Router} from "express";
const router = Router();
import { generateFlashcardsFromNote,searchFlashcards } from "../controllers/flashcard.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
router.use(isAuthenticated);
router.route("/:id/generate-flashcards").post(generateFlashcardsFromNote) 
router.route('/search').get(searchFlashcards)

export default router;