import { Router } from "express";
const route = Router();
import User from "../models/user.models.js";
import Event from "../models/event.models.js";
import Venue from "../models/venue.models.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

route.get("/create", requireAuth, async (req, res) => {
    const venues = await Venue.find({});
    if (!venues) {
        return res.json({
            status: 404,
            message: "No event could be found",
            data: null
        })
    }
    if (venues.length === 0) {
        return res.json({
            status: 404,
            message: "No venues are registered so far",
            data: []
        })
    }
    const organizer = await User.findById(req.auth.userId).select("-password -refreshToken");
    if (!organizer) {
        return res.json({
            status: 404,
            message: "Could not find the user",
            data: null
        })
    }
    const isValid = organizer.roles[0] === "organizer";
    if (isValid) {
        return res.json({
            status: 200,
            message: "Organizer and venues fetched successfully",
            data: {
                venues: venues,
                user: organizer
            }
        })
    }

    return res.json({
        status: 401,
        message: "User found but he is not an Organizer",
        data: null
    })
});

export default route;