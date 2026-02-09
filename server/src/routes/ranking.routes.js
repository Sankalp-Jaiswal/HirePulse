import express from "express";
import { upload } from "../middleware/upload.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { rankCandidatesController } from "../controllers/ranking.controller.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("excel"),
  rankCandidatesController
);

export default router;
