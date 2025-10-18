import { Router } from "express";
import Venue from "../models/venue.models.js";
import User from "../models/user.models.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { v2 as cloudinary } from 'cloudinary';
import { upload } from "../middlewares/multer.js";

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

route.post("/create", requireAuth, upload.array("images", 5), async (req, res) => {
    try {
        const { name, location, capacity, pricePerHour, availableFrom, availableTo } = req.body;
        const files = req.files;
        const user = await User.findById(req.auth.userId).select("-password -refreshToken");

        if (!user) return res.status(404).json({ status: 404, message: "User not found" });
        if (user.roles[0] !== "owner") return res.status(400).json({ status: 400, message: "Not an owner" });

        let venue_images = [];
        if (files && files.length > 0) {
            venue_images = await Promise.all(files.map(file =>
                new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { resource_type: "image", folder: "venues/images/" },
                        (error, result) => {
                            if (error) return reject(error);
                            resolve(result.secure_url);
                        }
                    );
                    stream.end(file.buffer);
                })
            ));
        }

        const newVenue = await Venue.create({
            name,
            location,
            capacity,
            pricePerHour,
            availableFrom,
            availableTo,
            owner: user._id,
            images: venue_images
        });

        return res.status(201).json({
            status: 201,
            message: "Venue created successfully",
            data: newVenue
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "Server error", error: err.message });
    }
});


export default route;