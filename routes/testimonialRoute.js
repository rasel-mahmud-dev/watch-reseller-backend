import express from "express"
import response from "../response";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import Testimonial from "../models/Testimonial";
const router = express.Router()


// [GET]  api/v1/testimonials find all testimonials
router.get("/", async function (req, res, next) {
    try {
        let testimonials = await Testimonial.find()
        response(res, testimonials, 200)
    } catch (ex) {
        next(ex)
    }
})

// [POST]  api/v1/testimonial create a new testimonial
router.post("/", auth, role(["BUYER", "SELLER"]), async function (req, res, next) {
    try {
        let newTestimonial = new Testimonial({
            rate: req.body.rate,
            text: req.body.text,
            customerName: req.body.customerName,
            customerAvatar: req.body.customerAvatar,
        })
        newTestimonial = await newTestimonial.save()
        if(newTestimonial) {
            response(res, newTestimonial, 201)
        } else{
            response(res, "Testimonial adding fail", 500)
        }
    } catch (ex) {
        next(ex)
    }
})


export default router
