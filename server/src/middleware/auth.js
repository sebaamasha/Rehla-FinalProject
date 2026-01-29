import jwt from "jsonwebtoken";
import User from "../models/User.js";

const JWT_SECRET = process.env.JWT_SECRET || "rehla_super_secret_key_2024";

/**
 * Auth middleware - protects routes that require authentication
 * Adds req.user with the authenticated user
 */
export async function requireAuth(req, res, next) {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const token = authHeader.split(" ")[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        // Attach user to request
        req.user = user;
        next();
    } catch (err) {
        if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
        res.status(500).json({ message: "Authentication failed" });
    }
}

/**
 * Optional auth middleware - doesn't require auth but adds user if token exists
 */
export async function optionalAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        }
    } catch (err) {
        // Ignore errors - just continue without user
    }
    next();
}
