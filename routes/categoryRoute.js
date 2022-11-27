import express from "express"
import response from "../response";
import Category from "../models/Category";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import Product from "../models/Product";
import {ObjectId} from "mongodb";


const router = express.Router()


// [GET]  api/v1/category find all categories
router.get("/", async function (req, res, next) {
    try {
        let categories = await Category.find()
        response(res, categories, 200)
    } catch (ex) {
        next(ex)
    }
})

// [GET]  api/v1/category create a new category
router.post("/", async function (req, res, next) {
    try {
        let newCat = new Category({name: req.body.name, picture: req.body.picture})
        newCat = await newCat.save()
        if(newCat) {
            response(res, newCat, 201)
        } else{
            response(res, "Category adding fail", 500)
        }
    } catch (ex) {
        next(ex)
    }
})


// [GET]  api/v1/category/category-product/:categoryId find all products for specific category
router.get("/category-product/:categoryId", async function (req, res, next) {
    try {

        let products = await Product.aggregate([
            {$match: {categoryId: new ObjectId(req.params.categoryId)}},
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "seller"
                }
            },

            // skip these doc that not join with users collections
            {$unwind: {path: "$seller", preserveNullAndEmptyArrays: false}},
            {
                $project: {
                    seller: {
                        username: "$seller.username",
                        email: "$seller.email",
                        avatar: "$seller.avatar",
                        isVerified: "$seller.isVerified",
                    },
                    sellerId: "$sellerId",
                    categoryId: "$categoryId",
                    title: "$title",
                    location: "$location",
                    isSold: "$isSold",
                    resalePrice: "$resalePrice",
                    originalPrice: "$originalPrice",
                    picture: "$picture",
                    phone: "$phone",
                    conditionType: "$conditionType",
                    purchaseDate: "$purchaseDate",
                    createdAt: "$createdAt",
                    updatedAt: "$updatedAt",
                }
            }
        ])
        response(res, products, 200)
    } catch (ex) {
        next(ex)
    }
})

export default router
