import express from "express"
import response from "../response";
import Watch from "../models/Watch";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import {ObjectId} from "mongodb";


const router = express.Router()

// [GET]  api/v1/watch find all watches
router.get("/", async function (req, res, next) {
    try {
        let watches = await (await Watch.collection).find({}).toArray()
        response(res, watches, 200)
    } catch (ex) {
        next(ex)
    }
})


// [POST] api/v1/watch create new watch
router.post("/", auth, role(["SELLER"]), async function (req, res, next) {
    const {
        title,
        location,
        isAvailable,
        resalePrice,
        originalPrice,
        picture,
        conditionType,
        mobileNumber,
        description,
        purchaseDate,
    } = req.body

    try {
        let newWatch = new Watch({
            title,
            location,
            isAvailable,
            resalePrice,
            originalPrice,
            picture,
            conditionType,
            mobileNumber,
            description,
            purchaseDate,
        })
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



export default router
