import express from "express"
import User from "../models/User";
import {createToken, parseToken} from "../jwt";
import response from "../response";
import getCookie from "../utils/getCookie";
import auth from "../middlewares/auth";


const router = express.Router()

let cookieExpirationDate = new Date(Date.now() + 1000 * 3600 * 24 * 7); // 7 days

router.post("/generate-token", async function (req, res, next) {
    const {
        googleId,
        username,
        avatar,
        role = "BUYER",
        phone,
        email,
        location,
    } = req.body

    try {
        let user = await (await User.collection).findOne({email: email})
        let token = ""
        if (!user) {
            let namePart = username.split(" ")
            let newUser = new User({
                email,
                googleId,
                firstName: namePart[0] ? namePart[0] : "",
                lastName: namePart[1] ? namePart[1] : "",
                username: username,
                avatar,
                role,
                phone,
                location,
            })

            newUser = await newUser.save();
            if (!newUser) {
                return response(res, "User creation fail, Please try again", 403)
            }

            token = createToken(newUser._id, email)
        } else {
            token = createToken(user._id, email)
        }

        // send cookie in header to set client browser
        res.cookie("token", token, {
            domain: process.env.CLIENT,
            path: "/",
            secure: true,
            expires: cookieExpirationDate,
            httpOnly: true,
        });
        return response(res, user, 201)

    } catch (ex) {
        next(ex)
    }
})


router.get("/get-current-user", auth, async function (req, res, next) {
    try {
        let user = await (await User.collection).findOne({email: req.user.email})
        if (user) {
            return response(res, user, 200)
        } else {
            return response(res, null, 404)
        }
    } catch (ex) {
        next(ex)
    }
})


router.get("/validate-token", async function (req, res, next) {
    try {
        let token = getCookie("token", req)
        if (!token) {
            return response(res, "token not found", 401)
        }
        let data = await parseToken(token)
        response(res, data)

    } catch (ex) {
        next(ex)
    }
})


export default router
