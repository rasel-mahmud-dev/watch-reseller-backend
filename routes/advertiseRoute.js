import {ObjectId} from "mongodb";
import response from "../response";

import Advertise from "../models/Advertise";
import auth from "../middlewares/auth";
import role from "../middlewares/role";

import express from "express";

const router = express.Router()


// [POST]  api/v1/advertise to get all advertise products
router.get("/", async function (req, res, next) {
    try {
        let items = await (await Advertise.collection).aggregate([
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
                $lookup: {
                    from: "users",
                    localField: "product.sellerId",
                    foreignField: "_id",
                    as: "seller"
                }
            },

            // only show that product has been exists on product collections
            // { $match: { productId: "$product._id" } },

            {$unwind: {path: "$seller", preserveNullAndEmptyArrays: true}},
            {
                $project: {
                    sellerId: "$product.sellerId",
                    categoryId: "$product.categoryId",
                    seller: {
                        username: "$seller.username",
                        email: "$seller.email",
                        avatar: "$seller.avatar",
                        isVerified: "$seller.isVerified",
                    },
                    productId: "$product._id",
                    title: "$product.title",
                    location: "$product.location",
                    isSold: "$product.isSold",
                    resalePrice: "$product.resalePrice",
                    originalPrice: "$product.originalPrice",
                    picture: "$product.picture",
                    phone: "$product.phone",
                    conditionType: "$product.conditionType",
                    purchaseDate: "$product.purchaseDate",
                    createdAt: "$product.createdAt",
                    updatedAt: "$product.updatedAt",
                }
            }
        ]).toArray();
        response(res, items)
    } catch (ex) {
        next(ex)
    }
})


// [POST]  api/v1/advertise add to advertise
router.post("/", auth, role(["SELLER"]), async function (req, res, next) {
    try {
        const {productId} = req.body

        if (!productId) return response(res, "Please provide product id", 401)

        let productObjectId = new ObjectId(productId)

        let updateResult = await (await Advertise.collection).updateOne(
            {productId: productObjectId},
            {
                $set: {
                    productId: productObjectId
                }
            },
            {upsert: true}
        )
        response(res, "product successfully added for advertise", 201)
    } catch (ex) {
        next(ex)
    }
})


export default router