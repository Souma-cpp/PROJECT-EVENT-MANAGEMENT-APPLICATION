import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Venue'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Organizer',
        required: true
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    revenue: Number,
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    thumbnail: { type: String, trim: true }
}, {
    timestamps: true
});

const Event = mongoose.model('Event', eventSchema);
export default Event;