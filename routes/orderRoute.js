import {ObjectId} from "mongodb";
import response from "../response";
import Advertise from "../models/Advertise";
import auth from "../middlewares/auth";
import role from "../middlewares/role";

import express from "express";
import Order from "../models/Order";

const router = express.Router()


// [POST]  api/v1/order create order
router.post("/", auth, role(["BUYER", "SELLER", "ADMIN"]), async function (req, res, next) {
    try {
        const {
            productId,
            username,
            email,
            title,
            price,
            phone,
            meetingAddress,
        } = req.body
        if (!productId) return response(res, "Please provide product id", 401)

        let newOrder = new Order({
            productId: new ObjectId(productId),
            sellerId: new ObjectId(req.user.userId),
            title,
            price,
            phone,
            meetingAddress,
        })
        newOrder = await newOrder.save()
        if (!newOrder) {
            return response(res, "Order creation fail")
        }
        response(res, newOrder, 201)

    } catch (ex) {
        next(ex)
    }
})


export default router