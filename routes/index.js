import express from "express";
import authRoute from "./authRoute";
import watchRoute from "./watchRoute";
import categoryRoute from "./categoryRoute";

const router = express.Router()


router.use("/api/v1/auth", authRoute)
router.use("/api/v1/watch", watchRoute)
router.use("/api/v1/category", categoryRoute)


export default router