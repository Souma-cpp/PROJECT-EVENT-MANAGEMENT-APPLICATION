// middleware/auth.js
import jwt from "jsonwebtoken";

export const requireAuth = (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer ")) return res.status(401).json({ msg: "No token" });

    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.auth = { userId: payload.sub, roles: payload.roles };
        next();
    } catch {
        return res.status(401).json({ msg: "Invalid token" });
    }
};

export const requireRole = (allowedRoles = []) => (req, res, next) => {
    const userRoles = req.auth?.roles || [];
    if (!allowedRoles.some(r => userRoles.includes(r))) return res.status(403).json({ msg: "Forbidden" });
    next();
};
