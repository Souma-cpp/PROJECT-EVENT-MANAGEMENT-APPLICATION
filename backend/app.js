import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectToDatabase from "./db/config.js";
import userRouter from "./routes/user.routes.js"
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
//app.use("/api/organizer" , organizerRouter) ;
//app.use("/api/owner" , ownerRouter) ;

connectToDatabase().then(() => {
    app.listen(port, () => {
        console.log("Server has started ✅");
    })
}).catch((error) => {
    console.log("The error is :", error)
})