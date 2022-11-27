import express from "express"
import response from "../response";
import {ObjectId} from "mongodb";
import auth from "../middlewares/auth";
import Wishlist from "../models/Wishlist";


const router = express.Router()

// [GET]  api/v1/wishlist find all wishlist for current logged user
router.get("/", auth, async function (req, res, next) {
    try {
        let wishlistProducts = await Wishlist.aggregate([
            {$match: {buyerId: new ObjectId(req.user.userId)}},
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            // skip if product not found
            {$unwind: {path: "$product", preserveNullAndEmptyArrays: false}},
            {
                $project: {
                    productId: "$productId",
                    title: "$product.title",
                    isSold: "$product.isSold",
                    price: "$product.resalePrice",
                    picture: "$product.picture",
                    phone: "$product.phone",
                }
            }
        ])
        response(res, wishlistProducts, 200)
    } catch (ex) {
        next(ex)
    }
})

// [GET]  api/v1/wishlist create a new wishlist
router.post("/", auth, async function (req, res, next) {
    try {
        let newWishlist = new Wishlist({
            productId: new ObjectId(req.body.productId),
            buyerId: new ObjectId(req.user.userId)
        })
        newWishlist = await newWishlist.save()
        if (newWishlist) {
            response(res, newWishlist, 201)
        } else {
            response(res, "wishlist adding fail", 500)
        }
    } catch (ex) {
        next(ex)
    }
})

// [DELETE] api/v1/wishlist/:id delete wishlist
router.delete("/:id", auth, async function (req, res, next) {
    try {
        let deleteResult = await Wishlist.deleteOne({
            buyerId: new ObjectId(req.user.userId),
            _id: new ObjectId(req.params.id)
        })
        response(res, "deleted", 201)
    } catch (ex) {
        next(ex)
    }
})


export default router
