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


