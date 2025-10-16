import mongoose from "mongoose";
import User from "../models/user.models.js";
import Event from "../models/event.models.js";


export const allEvents = async (req, res) => {
    const events = await Event.find({});
    if (!events) {
        return res.json({
            status: 404,
            message: 'No events found',
            data: null
        })
    }

    if (events.length == 0) {
        return res.json({
            status: 404,
            message: 'No events are decided yet',
            data: null
        })
    }

    return res.json({
        status: 201,
        message: 'Events fetched successfully',
        data: events
    })
}

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.auth.userId).select("-passwordHash -refreshTokens")
        if (!user) {
            return res.json({
                status: 404,
                message: "User is not found",
                data: null
            })
        }
        return res.json({
            status: 200,
            message: "User data has been fetched successfully",
            data: user
        })
    } catch (error) {
        console.log("Some error happened while fetching the user details", error);
        return res.json({
            status: 500,
            message: "Something wrong happened in fetching the user details",
            data: null
        })
    }
}


