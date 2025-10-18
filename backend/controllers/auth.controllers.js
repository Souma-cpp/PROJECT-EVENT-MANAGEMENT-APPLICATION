// controllers/auth.js
import User from "../models/user.models.js";
import { hashPassword, comparePassword, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/auth.utils.js";
import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from 'cloudinary'

const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/"
};

// REGISTER
export const register = async (req, res) => {
    const { name, email, password, roleIntent } = req.body;
    const file = req.file;
    //console.log(req.body)
    //console.log("The avatar body", avatar);

    if (!name || !email || !password) return res.status(400).json({ msg: "Missing fields" });
    if (!["user", "organizer", "owner"].includes(roleIntent)) return res.status(400).json({ msg: "Invalid role" });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ msg: "Email already in use" });

    const passwordHash = await hashPassword(password);

    let avatarUrl = null;
    if (file) {
        avatarUrl = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "image",
                    folder: "users/avatars"
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
    }

    const user = await User.create({
        name,
        email,
        passwordHash,
        roles: [roleIntent],
        avatar: avatarUrl
    });

    res.status(201).json({
        status: 201,
        msg: "Registered successfully",
        userId: user._id
    });
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password, roleIntent } = req.body;
        if (!email || !password || !roleIntent) {
            return res.status(400).json({ msg: "Email, password, and roleIntent are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ msg: "Invalid credentials" });

        if (!user.passwordHash) {
            console.error("Login attempt with missing passwordHash for user:", user._id);
            return res.status(500).json({ msg: "User has no password set. Contact support or re-register." });
        }

        const ok = await comparePassword(password, user.passwordHash);
        if (!ok) return res.status(401).json({ msg: "Invalid credentials" });

        // Check roleIntent matches user roles
        if (!user.roles.includes(roleIntent)) return res.status(403).json({ msg: `Not a ${roleIntent}` });

        // Create JWT payload
        const payload = { sub: user._id.toString(), roles: user.roles };
        const accessToken = signAccessToken(payload);
        const refreshToken = signRefreshToken({ sub: user._id.toString() });

        // Store refresh token in DB
        user.refreshTokens = user.refreshTokens || [];
        user.refreshTokens.push({ token: refreshToken, createdAt: new Date() });
        await user.save();

        // Set refresh token as cookie and return access token + roles
        res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        res.json({ accessToken, roles: user.roles });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({
            status: 200,
            msg: "Server error during login",
        });
    }
};


// LOGOUT
export const logout = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (token) {
        try {
            const payload = verifyRefreshToken(token);
            const user = await User.findById(payload.sub);
            if (user) {
                user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
                await user.save();
            }
        } catch { }
    }
    res.clearCookie("refreshToken", { path: "/" });
    res.json({ msg: "Logged out" });
};

// REFRESH
export const refresh = async (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ msg: "No refresh token" });

    let payload;
    try { payload = verifyRefreshToken(token); } catch { return res.status(401).json({ msg: "Invalid refresh token" }); }

    const user = await User.findById(payload.sub);
    if (!user || !user.refreshTokens.some(rt => rt.token === token)) {
        user.refreshTokens = [];
        await user.save();
        return res.status(401).json({ msg: "Refresh token revoked" });
    }

    // rotate refresh token
    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== token);
    const newRefreshToken = signRefreshToken({ sub: user._id.toString() });
    user.refreshTokens.push({ token: newRefreshToken, createdAt: new Date() });
    await user.save();

    const newAccessToken = signAccessToken({ sub: user._id.toString(), roles: user.roles });
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.json({ accessToken: newAccessToken });
};

export const dashboard = async (req, res) => {
    const user = await User.findById(req.auth.userId).select("-passwordHash -refreshTokens");
    res.json(user);
};
