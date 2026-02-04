import { verifyToken } from "../utils/tokens.js";

const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const result = verifyToken(requiredRole, token);

        if (!result.valid) {
            return res.status(401).json({ message: result.reason || "Invalid token" });
        }

        req.user = result.data;
        next();
    };
};

export default authMiddleware;
