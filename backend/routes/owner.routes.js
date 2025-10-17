import { Router } from "express";
import Venue from "../models/venue.models.js";
import User from "../models/user.models.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const route = Router();

route.get("/create", requireAuth, async (req, res) => {
    const user = await User.findById(req.auth.userId).select("-password -refreshToken");
    if (!user) {
        return res.json({
            status: 404,
            message: "User is not found",
            data: null
        })
    }
    if (user.roles[0] !== "owner") {
        return res.json({
            status: 400,
            message: "User is not an owner so he can not create or list venues",
            data: null
        })
    }

    return res.json({
        status: 200,
        message: "User exists and user is a property owner so he can list venues",
        data: user
    })
});

route.post("/create", async (req, res) => {
    return res.json({
        message: "The post request for venue creation arrived"
    })
})

export default route;