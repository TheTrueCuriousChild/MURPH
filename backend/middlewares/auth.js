import { verifyToken } from "../utils/tokens.js";

const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        // DEBUG LOGGING
        console.log("Auth Middleware Hit");
        console.log("Cookies:", req.cookies);
        console.log("Headers:", req.headers);

        let token = null;

        if (req.headers.authorization) {
            const authHeader = req.headers.authorization;
            if (authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7, authHeader.length);
            }
        }

        if (!token && req.cookies?.accessToken) {
            token = req.cookies.accessToken;
        }

        console.log("Extracted Token:", token ? "Found" : "Missing");

        if (!token) {
            console.log("Auth failed: No token");
            return res.status(401).json({ message: "Not authenticated" });
        }

        const result = verifyToken(requiredRole, token);
        console.log("Token Verification Result:", result);

        if (!result.valid) {
            console.log("Auth failed:", result.reason);
            return res.status(401).json({ message: result.reason || "Invalid token" });
        }

        req.user = result.data;
        next();
    };
};

export default authMiddleware;
