import mongoose from "mongoose"
import { Router } from "express"
import { allEvents } from "../controllers/user.controllers.js";
const router = Router();

router.get("/allEvents", allEvents);

export default router;