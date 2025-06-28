import {Router} from "express";
import { createNote, getAllNotes, updateNote, deleteNote, uploadPdfNote, generateQuizFromNote } from "../controllers/note.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
 import { upload } from "../middlewares/upload.js";
const router = Router();

router.use(isAuthenticated);

router.route("/")
  .post(createNote)
  .get(getAllNotes);

router.route("/:id")
  .put(updateNote)
  .delete(deleteNote);

router.route("/upload-pdf").post(upload.single("pdf"), uploadPdfNote)

router.route("/:id/genrate-quiz").post(generateQuizFromNote)
export default router;
  