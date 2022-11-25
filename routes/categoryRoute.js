import express from "express"
import response from "../response";
import Category from "../models/Category";


const router = express.Router()


// [GET]  api/v1/category find all categories
router.get("/", async function (req, res, next) {
    try {
        let categories = await (await Category.collection).find({}).toArray()
        response(res, categories, 200)
    } catch (ex) {
        next(ex)
    }
})



export default router
