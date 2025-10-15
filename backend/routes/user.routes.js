import mongoose from "mongoose"
import { Router } from "express"
import { allEvents } from "../controllers/user.controllers.js";
import { requireAuth } from "../middlewares/auth.middleware.js"
const router = Router();

router.get("/allEvents", allEvents);

router.get("/me", requireAuth, async (req, res) => {
    res.json({
        status: 404,
        message: "No details found",
        data: []
    })
})


export default router;