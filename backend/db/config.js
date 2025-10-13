
import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config()

const connectToDatabase = async () => {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected ✅, ");
    } catch (error) {
        console.log("Error while connecting to the database ❌")
    }
}

export default connectToDatabase;