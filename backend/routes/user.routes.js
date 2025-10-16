import mongoose from "mongoose"
import { Router } from "express"
import { allEvents, me } from "../controllers/user.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = Router();

router.get("/allEvents", allEvents); //api/users/allEvents (get)

router.get("/me", requireAuth, me); //api/users/me (get)

export default router;