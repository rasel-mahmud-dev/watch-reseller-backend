import express from "express"
import response from "../response";
import Watch from "../models/Watch";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import {ObjectId} from "mongodb";
import Advertise from "../models/Advertise";


const router = express.Router()


// [GET]  api/v1/watch find all watches for specific seller
router.get("/",  auth, role(["SELLER"]),  async function (req, res, next) {
    try {
        let watches = await (await Watch.collection).find({sellerId: new ObjectId(req.user.userId)}).toArray()
        response(res, watches, 200)
    } catch (ex) {
        next(ex)
    }
})


// [POST] api/v1/watch create new watch
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
        let newWatch = new Watch({
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



// [DELETE]  api/v1/watch/:id find all watches
router.delete("/:id", auth, role(["SELLER"]), async function (req, res, next) {
    try {
        let deleteResult = await Watch.deleteOne({_id: new ObjectId(req.params.id), sellerId: new ObjectId(req.user.userId)})
        console.log(deleteResult)
        response(res, "deleted", 201)
    } catch (ex) {
        next(ex)
    }
})




// [GET]  api/v1/watch/add-advertise add to advertise
router.get("/add-advertise/:productId", auth, role(["SELLER"]), async function (req, res, next) {
    try {
        let productId = new ObjectId(req.params.productId)
        let updateResult = await (await Advertise).updateOne(
            {productId: productId},
            { $set: {
                productId: productId
            }},
            { upsert: true }
        )

        console.log(updateResult)

        response(res, "deleted", 201)
    } catch (ex) {
        next(ex)
    }
})



export default router
