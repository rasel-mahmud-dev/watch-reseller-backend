import express from "express";;
import authRoute from "./authRoute";
import watchRoute from "./watchRoute";

const router = express.Router()


router.use("/api/v1/auth", authRoute)
router.use("/api/v1/watch", watchRoute)


export default router