import { Router } from "express";
import { chatWithAgent } from "../controllers/ai.controllers.js";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

// Chat is available for all authenticated users (students and teachers)
router.post("/", authMiddleware("user"), chatWithAgent);
router.post("/teacher", authMiddleware("teacher"), chatWithAgent);

export default router;
