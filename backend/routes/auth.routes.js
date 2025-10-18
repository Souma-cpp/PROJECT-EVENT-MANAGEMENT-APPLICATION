// routes/auth.js
import express from "express";
import { register, login, logout, refresh, dashboard } from "../controllers/auth.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js"
import dotenv from "dotenv"
dotenv.config();
import { upload } from "../middlewares/multer.js"
const router = express.Router();

router.post("/register", upload.single("avatar"), register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refresh);

router.get("/dashboard", requireAuth, dashboard); //keep the dashboard route in the users and make the corresponding frontend fetching changes

export default router;
