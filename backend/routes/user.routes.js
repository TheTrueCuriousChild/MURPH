import { Router } from "express"
import { userLogin, userLogout, userSignup } from "../controllers/auth.controllers.js";

const app = Router()

app.post("/signup", userSignup)
app.post("/login", userLogin)
app.post("/logout", userLogout)

const userRouter = app;
export default userRouter;
