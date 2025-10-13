import mongoose from "mongoose";

const organizerSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    isVerified: Boolean,
    organizedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    rating: {
        type: Number,
        min: 0,
        max: 5
    },
    contactInfo: {
        phone: String,
        address: String
    },
    premiumOrganizer: Boolean
});

const Organizer = mongoose.model('Organizer', organizerSchema);
export default Organizer;