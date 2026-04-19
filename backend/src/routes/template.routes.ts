import { Router } from "express";
import templateController from "../controllers/template.controller";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate);

router.post("/", templateController.createTemplate);
router.get("/workspace/:workspaceId", templateController.getTemplates);
router.post("/:templateId/create-task", templateController.createTaskFromTemplate);

export default router;
