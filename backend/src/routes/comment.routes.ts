import { Router } from "express";
import commentController from "../controllers/comment.controller.js";
import validate from "../middleware/validate.js";
import { authenticate } from "../middleware/auth.js";
import { addCommentSchema } from "../validators/comment.validator.js";

const router = Router();

router.use(authenticate);

router.post("/:taskId", validate(addCommentSchema), commentController.addComment);
router.get("/:taskId", commentController.getComments);

export default router;
