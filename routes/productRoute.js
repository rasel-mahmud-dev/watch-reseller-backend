import express from "express"
import response from "../response";
import Product from "../models/Product";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import {ObjectId} from "mongodb";


const router = express.Router()


// [GET]  api/v1/product find all watches for specific seller
router.get("/",  auth, role(["SELLER"]),  async function (req, res, next) {
    try {
        let watches = await (await Product.collection).find({sellerId: new ObjectId(req.user.userId)}).toArray()
        response(res, watches, 200)
    } catch (ex) {
        next(ex)
    }
})


// [POST] api/v1/product create new watch
router.post("/", auth, role(["SELLER"]),  async function (req, res, next) {
    const {
        title,
        resalePrice,
        originalPrice,
        picture,
        categoryId,
        conditionType,
        phone,
        purchaseDate,
        location,
        description,
    } = req.body

    try {
        let newWatch = new Product({
            title,
            location,
            resalePrice,
            originalPrice,
            picture,
            sellerId: new ObjectId(req.user.userId),
            categoryId: new ObjectId(categoryId),
            conditionType,
            phone,
            description,
            purchaseDate: new Date(purchaseDate),
        })
        newWatch = await newWatch.save()
        if(!newWatch){
            return response(res, "product save fail, Please try again", 500)
        }

        response(res, newWatch, 201)

    } catch (ex) {
        next(ex)
    }
})



// [DELETE]  api/v1/product/:id find all watches
router.delete("/:id", auth, role(["SELLER"]), async function (req, res, next) {
    try {
        let deleteResult = await Product.deleteOne({_id: new ObjectId(req.params.id), sellerId: new ObjectId(req.user.userId)})
        console.log(deleteResult)
        response(res, "deleted", 201)
    } catch (ex) {
        next(ex)
    }
})


export default router
