import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // Common fields for all roles
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordHash: {
        type: String
    },
    phone: {
        type: String,
        trim: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    avatar: { type: String, trim: true },
    roles: {
        type: [String],
        enum: ["user", "organizer", "owner", "admin"],
        default: ["user"]
    },
    walletAmount: {
        type: Number,
        default: 0
    },
    reputation: {
        type: String
    },

    // User-specific fields
    attendedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    bookedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],

    // Organizer-specific fields
    organizedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }],
    contactInfo: {
        phone: String,
        address: String
    },
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    premiumOrganizer: {
        type: Boolean,
        default: false
    },

    // Owner-specific fields
    venues: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue"
    }],

    createdAt: {
        type: Date,
        default: Date.now
    },
    refreshTokens: [
        {
            token: { type: String },
            createdAt: { type: Date, default: Date.now }
        }
    ],
});

// Optional: add indexes for quick role lookups
userSchema.index({ email: 1 });
userSchema.index({ roles: 1 });

const User = mongoose.model("User", userSchema);
export default User;
