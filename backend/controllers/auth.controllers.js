import bcrypt from "bcrypt";
import prisma from "../utils/prisma.js"
import { generateAccessToken } from "../utils/tokens.js";

const userLogin = async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        return res.sendResponse(400, false, "Invalid Credentials")
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
        return res.sendResponse(400, false, "Invalid Credentials")
    }

    const token = generateAccessToken("user", user.email);

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.sendResponse(200, true, "User login successful.", { token, user })
};

const userLogout = (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
    });

    res.sendResponse(200, true, "User logout successful.")
};

const userSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });
        const token = generateAccessToken("user", user.email);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.sendResponse(201, true, "User registered successfully", { token, user });
    } catch (error) {
        res.sendResponse(500, false, "Failed to register user", { error: error.message });
    }
};


const teacherSignup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const teacher = await prisma.teacher.create({
            data: { username, email, password: hashedPassword }
        });
        const token = generateAccessToken("teacher", teacher.email);

        res.cookie("accessToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        res.sendResponse(201, true, "Teacher registered successfully", { token, teacher });
    } catch (error) {
        res.sendResponse(500, false, "Failed to register teacher", { error: error.message });
    }
};

const teacherLogin = async (req, res) => {
    const { email, password } = req.body;

    const teacher = await prisma.teacher.findUnique({
        where: { email }
    });

    if (!teacher) {
        return res.sendResponse(400, false, "Invalid Credentials")
    }

    const isValid = await bcrypt.compare(password, teacher.password);

    if (!isValid) {
        return res.sendResponse(400, false, "Invalid Credentials")
    }

    const token = generateAccessToken("teacher", teacher.email);

    res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000
    });

    res.sendResponse(200, true, "Teacher login successful.", { token, teacher })
};

const addFunds = async (req, res) => {
    const { amount } = req.body;
    const userEmail = req.user.email;

    try {
        const user = await prisma.user.update({
            where: { email: userEmail },
            data: { walletBalance: { increment: amount } }
        });
        res.sendResponse(200, true, `Added ${amount} to wallet`, user);
    } catch (error) {
        res.sendResponse(500, false, "Failed to add funds", { error: error.message });
    }
};

export {
    userLogin,
    userLogout,
    userSignup,
    teacherLogin,
    teacherSignup,
    addFunds
};

