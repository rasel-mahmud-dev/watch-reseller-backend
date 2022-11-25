import {ObjectId} from "mongodb";
import response from "../response";
import auth from "../middlewares/auth";
import role from "../middlewares/role";

import express from "express";
import Order from "../models/Order";
import Product from "../models/Product";

const router = express.Router()


// [GET]  api/v1/order get all customer order
router.get("/", auth, role(["BUYER", "SELLER", "ADMIN"]), async function (req, res, next) {
        try {

            let orders = await (await Order.collection).aggregate([
                {
                    $match: {buyerId: new ObjectId(req.user.userId)}
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "productId",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {$unwind: {path: "$product", preserveNullAndEmptyArrays: true}},
                {
                    $project: {
                        sellerId: "$sellerId",
                        productId: "$productId",
                        title: "$product.title",
                        picture: "$product.picture",
                        price: "$price",
                        meetingAddress: "$meetingAddress",
                    }
                }

            ]).toArray()

            response(res, orders, 200)

        } catch
            (ex) {
            next(ex)
        }
    }
)


// [POST]  api/v1/order create order
router.post("/", auth, role(["BUYER", "SELLER", "ADMIN"]), async function (req, res, next) {
    try {
        const {
            productId,
            sellerId,
            username,
            email,
            title,
            price,
            phone,
            meetingAddress,
        } = req.body

        if (!productId) return response(res, "Please provide product id", 401)

        let product = await (await Product.collection).findOne(
            {_id: new ObjectId(productId)}
        )
        if (!product) {
            return response(res, "Product not found", 404)
        }

        if (product.isSold) {
            return response(res, "This Product Already has been sold by someone", 401)
        }

        let newOrder = new Order({
            productId: new ObjectId(productId),
            buyerId: new ObjectId(req.user.userId),
            sellerId: new ObjectId(sellerId),
            title,
            price,
            isPay: false,
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