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

route.post("/create", requireAuth, async (req, res) => {
    const { name, location, capacity, pricePerHour, availableFrom, availableTo } = req.body;
    const user = await User.findById(req.auth.userId).select("-password -refreshToken");
    if (!user) {
        return res.json({
            status: 404,
            message: "User does not exist",
            data: null
        });
    }
    if (user.roles[0] !== "owner") {
        return res.json({
            status: 400,
            message: "User is not a property owner so can not list a venue",
            data: null
        });
    }

    const newVenue = await Venue.create({
        name,
        location,
        capacity,
        pricePerHour,
        availableFrom,
        availableTo,
        owner: user._id
    });

    return res.json({
        status: 201,
        message: "Venue has been created successfully",
        data: newVenue.name
    })
})

export default route;