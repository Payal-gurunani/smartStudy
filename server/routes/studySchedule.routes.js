import {Router} from "express";
import {
  createStudyReminder,deleteStudyReminder,getStudyReminders,
  updateReminderStatus} from "../controllers/studySchedule.controller.js";
  import { isAuthenticated } from "../middlewares/isAuthenticated.js";
  const router = Router();

  router.use(isAuthenticated);

router.route("/").post(createStudyReminder);
router.route("/").get(getStudyReminders);
router.route("/:id").patch(updateReminderStatus)
router.route("/:id").delete(deleteStudyReminder)

export default router;