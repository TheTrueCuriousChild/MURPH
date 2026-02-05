import express from "express";
import { teacherLogin, teacherSignup } from "../controllers/auth.controllers.js";
import {
    createCourse,
    getTeacherCourses,
    getCourseById,
    updateCourse,
    deleteCourse,
} from "../controllers/course.controllers.js";
import {
    addLecture,
    getCourseLectures,
    updateLecture,
    deleteLecture,
    previewLecture,
} from "../controllers/lecture.controllers.js";
import { getTeacherAnalytics } from "../controllers/analytics.controllers.js";
import authMiddleware from "../middlewares/auth.js";
import { uploadSingle } from "../utils/multer.js";


const router = express.Router();

// Public teacher auth routes
router.post("/signup", teacherSignup);
router.post("/login", teacherLogin);

// All other teacher routes are protected
router.use(authMiddleware("teacher"));

// Course CRUD
router.post("/courses", createCourse);
router.get("/courses", getTeacherCourses);
router.get("/courses/:id", getCourseById);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);

// Lecture CRUD
router.post("/lectures", uploadSingle("lecture"), addLecture);

router.get("/courses/:courseId/lectures", getCourseLectures);
router.put("/lectures/:id", updateLecture);
router.delete("/lectures/:id", deleteLecture);
router.get("/lectures/:id/preview", previewLecture);

// Analytics
router.get("/analytics", getTeacherAnalytics);

export default router;
