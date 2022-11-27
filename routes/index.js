import express from "express";
const router = express.Router()


import authRoute from "./authRoute";
import productRoute from "./productRoute";
import categoryRoute from "./categoryRoute";
import advertiseRoute from "./advertiseRoute";
import orderRoute from "./orderRoute";
import paymentRoute from "./paymentRoute";
import wishlistRoute from "./wishlistRoute";
import blogRoute from "./blogRoute";
import testimonialRoute from "./testimonialRoute";



router.use("/api/v1/auth", authRoute)
router.use("/api/v1/product", productRoute)
router.use("/api/v1/category", categoryRoute)
router.use("/api/v1/advertise", advertiseRoute)
router.use("/api/v1/order", orderRoute)
router.use("/api/v1/payment", paymentRoute)
router.use("/api/v1/wishlist", wishlistRoute)
router.use("/api/v1/blogs", blogRoute)
router.use("/api/v1/testimonials", testimonialRoute)



export default router