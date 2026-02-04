import express from "express";
import {
    startLectureSession,
    pauseSession,
    resumeSession,
    endSession,
    getSession,
    getSessionEscrowDetails,
} from "../controllers/session.controllers.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

// All session routes require user authentication
router.use(authMiddleware("user"));

// Session management
router.post("/start", startLectureSession);
router.post("/:sessionId/pause", pauseSession);
router.post("/:sessionId/resume", resumeSession);
router.post("/:sessionId/end", endSession);
router.get("/:sessionId/escrow", getSessionEscrowDetails);
router.get("/:sessionId", getSession);

export default router;
