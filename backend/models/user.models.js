import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isVerified: Boolean,
    AttendedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    walletAmount: Number,
    bookedEvents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    reputation: String
})

const User = mongoose.model('User', userSchema);
export default User;