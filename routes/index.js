import express from "express";
const router = express.Router()


import authRoute from "./authRoute";
import watchRoute from "./watchRoute";
import categoryRoute from "./categoryRoute";
import advertiseRoute from "./advertiseRoute";



router.use("/api/v1/auth", authRoute)
router.use("/api/v1/watch", watchRoute)
router.use("/api/v1/category", categoryRoute)
router.use("/api/v1/advertise", advertiseRoute)


export default router