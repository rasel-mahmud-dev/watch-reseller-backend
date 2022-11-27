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

        let orders = await Order.aggregate([
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
            {$unwind: {path: "$product", preserveNullAndEmptyArrays: false}},
            {
                $project: {
                    sellerId: "$sellerId",
                    productId: "$productId",
                    title: "$product.title",
                    picture: "$product.picture",
                    isSold: "$product.isSold",
                    price: "$price",
                    isPaid: "$isPaid",
                    meetingAddress: "$meetingAddress",
                }
            }

        ])

        response(res, orders, 200)

    } catch
        (ex) {
        next(ex)
    }
})


// [GET]  api/v1/order single order for payment or order detail
router.get("/:orderId", auth, async function (req, res, next) {
    try {

        let orderId = new ObjectId(req.params.orderId);
        let order = await Order.aggregate([
            {$match: {_id: orderId}},
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {$unwind: {path: "$product", preserveNullAndEmptyArrays: false}},
            {
                $project: {
                    sellerId: "$sellerId",
                    productId: "$productId",
                    title: "$product.title",
                    picture: "$product.picture",
                    price: "$price",
                    isPaid: "$isPaid",
                    meetingAddress: "$meetingAddress",
                    phone: "$phone",
                    createdAt: "$createdAt"
                }
            }
        ])
        response(res, order[0], 200)

    } catch
        (ex) {
        next(ex)
    }
})


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

        let product = await Product.findOne(
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
            isPaid: false,
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


// [DELETE]  api/v1/order/:orderId delete order
router.delete("/:orderId", auth, role(["BUYER"]), async function (req, res, next) {
    try {
        let deleteResult = await Order.deleteOne({
            buyerId: new ObjectId(req.user.userId),
            _id: new ObjectId(req.params.orderId)
        })
        console.log(deleteResult)
        response(res, "deleted", 201)
    } catch (ex) {
        next(ex)
    }
})


export default router