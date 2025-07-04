import {Router} from "express";
import { 
  createNote, 
  getSingleNote,
  getAllNotes, 
  updateNote, 
  deleteNote,
   uploadPdfNote, 
  generateQuizFromNote, 
  submitQuiz,
  getUserQuizResults,
  summarizeNote, 
  } from "../controllers/note.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
 import { upload } from "../middlewares/upload.js";
const router = Router();

router.use(isAuthenticated);

router.route("/")
  .post(createNote)
  .get(getAllNotes);

router.route("/:id")
  .get(getSingleNote)
  .put(updateNote)
  .delete(deleteNote);

router.route("/upload-pdf").post(upload.single("pdf"), uploadPdfNote)

router.route("/:id/summarize").post(summarizeNote)
export default router;
  