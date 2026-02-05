import { userLogin, userLogout, userSignup, addFunds } from "../controllers/auth.controllers.js";
import { getAllCourses, getCourseById } from "../controllers/course.controllers.js";
import authMiddleware from "../middlewares/auth.js";
import { Router } from "express";

const app = Router()

app.post("/signup", userSignup)
app.post("/login", userLogin)
app.post("/logout", userLogout)
app.get("/courses", authMiddleware("user"), getAllCourses)
app.get("/courses/:id", authMiddleware("user"), getCourseById)
app.post("/add-funds", authMiddleware("user"), addFunds)

const userRouter = app;
export default userRouter;
