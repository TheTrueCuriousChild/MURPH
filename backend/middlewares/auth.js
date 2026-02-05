import { verifyToken } from "../utils/tokens.js";

const authMiddleware = (requiredRole) => {
    return (req, res, next) => {
        // DEBUG LOGGING

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

<<<<<<< HEAD
        // Allow token via query param (useful for video streaming)
        if (!token && req.query?.token) {
            token = req.query.token;
        }

        console.log("Extracted Token:", token ? "Found" : "Missing");
=======
>>>>>>> 5c3546aa640bc7bbb66e32002bb794be9a46e5c4

        if (!token) {
            console.log("Auth failed: No token");
            return res.status(401).json({ message: "Not authenticated" });
        }

        const result = verifyToken(requiredRole, token);

        if (!result.valid) {
            console.log("Auth failed:", result.reason);
            return res.status(401).json({ message: result.reason || "Invalid token" });
        }

        req.user = result.data;
        next();
    };
};

export default authMiddleware;
