import mongoose from "mongoose";
const ownerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    venues: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Venue',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Owner = mongoose.model('Owner', ownerSchema);
export default Owner