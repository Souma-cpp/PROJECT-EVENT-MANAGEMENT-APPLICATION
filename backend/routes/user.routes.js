import mongoose from "mongoose"
import { Router } from "express"
import { clerkClient, requireAuth, getAuth } from '@clerk/express'
import { allEvents } from "../controllers/user.controllers.js";
const router = Router();

router.get("/allEvents", allEvents);



router.get("/me", requireAuth(), async (req, res) => {
    const { userId } = getAuth(req)
    const user = await clerkClient.users.getUser(userId)
    if (!user) {
        return res.json({
            status: 404,
            message: "The user could not be found",
            data: null
        })
    }
    return res.json({
        status: 200,
        message: "The user details are fetched successfully from clerk",
        data: {
            name: user.firstName,
            email: user.emailAddresses[0].emailAddress,
        }
    })
})


export default router;