import mongoose from "mongoose";
const venueSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    capacity: {
        type: Number,
        required: true,
        min: 1
    },
    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },
    availableFrom: {
        type: Date,
        required: true
    },
    availableTo: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    premiumOwner: Boolean
}, {
    timestamps: true
});

const Venue = mongoose.model('Venue', venueSchema);
export default Venue;