import express from "express"
import response from "../response";
import Blog from "../models/Blog";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
const router = express.Router()


// [GET]  api/v1/blogs find all blogs
router.get("/", async function (req, res, next) {
    try {
        let blogs = await Blog.find()
        response(res, blogs, 200)
    } catch (ex) {
        next(ex)
    }
})

// [POST]  api/v1/blogs create a new blog
router.post("/", auth, role(["ADMIN"]), async function (req, res, next) {
    try {
        let newBlog = new Blog({title: req.body.title, description: req.body.description})
        newBlog = await newBlog.save()
        if(newBlog) {
            response(res, newBlog, 201)
        } else{
            response(res, "Blog adding fail", 500)
        }
    } catch (ex) {
        next(ex)
    }
})


export default router
