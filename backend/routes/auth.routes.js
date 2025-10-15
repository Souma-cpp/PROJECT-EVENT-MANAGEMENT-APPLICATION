// routes/auth.js
import express from "express";
import { register, login, logout, refresh, dashboard } from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js"

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

router.get("/dashboard", requireAuth, dashboard);

export default router;
