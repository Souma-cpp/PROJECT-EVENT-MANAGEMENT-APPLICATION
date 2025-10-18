import { Router } from "express";
const route = Router();
import User from "../models/user.models.js";
import Event from "../models/event.models.js";
import Venue from "../models/venue.models.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
import { v2 as cloudinary } from 'cloudinary'


route.get("/create", requireAuth, async (req, res) => {
    const venues = await Venue.find({});
    if (!venues) {
        return res.json({
            status: 404,
            message: "No venues could be found",
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


    const user = await User.findById(req.auth.userId).select("-password -refreshToken");
    if (!user) {
        return res.json({
            status: 404,
            message: "Could not find the user",
            data: null
        })
    }
    return res.json({
        status: 200,
        message: "User and the venues are fetched successfully",
        data: {
            venues,
            user
        }
    })
});

route.post("/create", requireAuth, upload.single("thumbnail"), async (req, res) => {
    try {
        const { name, description, venue, date, duration } = req.body;
        const file = req.file;

        if (!file) {
            console.log("No files detected");
            return res.status(404).json({
                status: 404,
                message: "files not found",
                data: null
            });
        }

        // 1️⃣ Validate user
        const user = await User.findById(req.auth.userId).select("-password");
        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: null
            });
        }

        // 2️⃣ Fetch venue
        const desired_place = await Venue.findById(venue);
        if (!desired_place) {
            return res.status(404).json({
                status: 404,
                message: "Venue not found",
                data: null
            });
        }

        // 3️⃣ Prepare and normalize the date
        const event_date = new Date(date);
        event_date.setHours(0, 0, 0, 0); // Normalize to midnight for day-level comparison

        // 4️⃣ Check if date is within available range
        const isWithinRange =
            desired_place.availableFrom <= event_date &&
            event_date <= desired_place.availableTo;

        if (!isWithinRange) {
            return res.status(405).json({
                status: 405,
                message: "The venue is not available on that date (out of range).",
                data: null
            });
        }

        // 5️⃣ Check if the venue is already booked on that date
        const isAlreadyBooked = desired_place.bookedDates.some(
            (d) => new Date(d).getTime() === event_date.getTime()
        );

        if (isAlreadyBooked) {
            return res.status(409).json({
                status: 409,
                message: "The venue is already booked on this date.",
                data: null
            });
        }

        let thumbnailUrl = null;
        if (file) {
            thumbnailUrl = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "image",
                        folder: "events/thumbnails"
                    },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result.secure_url);
                    }
                );
                stream.end(file.buffer);
            });
        }

        // 6️⃣ Create the event
        const event = await Event.create({
            name,
            description,
            date: event_date,
            duration,
            location: desired_place._id,
            createdBy: user._id,
            thumbnail: thumbnailUrl
        });

        // 7️⃣ Mark that date as booked in the venue
        desired_place.bookedDates.push(event_date);
        await desired_place.save();

        // 8️⃣ Return success
        return res.status(201).json({
            status: 201,
            message: "Event created successfully and venue marked as booked.",
            data: event
        });
    } catch (error) {
        console.error("Error creating event:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            error: error.message
        });
    }
});

route.get("/events", async (req, res) => {
    const events = await Event.find({});
    if (!events) {
        return res.json({
            status: 404,
            message: "No events could be fetched",
            data: []
        })
    }

    return res.json({
        status: 200,
        message: "Events fetched successfully",
        data: events
    })
})

export default route;