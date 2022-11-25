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
        firstName,
        lastName,
        username,
        avatar,
        role = "BUYER",
        phone,
        email,
        location,
        address,
        isEntry = false
    } = req.body

    try {
        let userCollection = await User.collection
        let user = await userCollection.findOne({email: email})

        let token = ""
        if (!user) {
            // store new user
            let newUser = new User({
                email,
                googleId,
                firstName,
                lastName,
                username,
                avatar,
                role,
                phone,
                address,
                location,
            })

            user = await newUser.save();
            if (!user) {
                return response(res, "User creation fail, Please try again", 403)
            }
            if(!isEntry) {
                token = createToken(newUser._id, role, email)
            }
        } else {
            // update existing user
            let updateUser = {}
            if(firstName) updateUser.firstName = firstName
            if(lastName) updateUser.lastName = lastName
            if(googleId) updateUser.googleId = googleId
            if(username) updateUser.username = username
            if(avatar) updateUser.avatar = avatar
            if(phone) updateUser.phone = phone
            if(location) updateUser.location = location
            if(address) updateUser.address = address

            let updatedResult = await userCollection.updateOne(
                {email: email}, {$set: updateUser}
            )
            if(!isEntry) {
                token = createToken(user._id, user.role, email)
            }
        }

        if(!isEntry) {
            // send cookie in header to set client browser
            res.cookie("token", token, {
                domain: process.env.CLIENT,
                path: "/",
                secure: true,
                expires: cookieExpirationDate,
                httpOnly: true,
            });
        }
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


router.get("/logout",   async function (req, res, next) {
    try {
        res.cookie("token", "", {
            domain: process.env.CLIENT,
            path: "/",
            secure: true,
            expires: 0,
            httpOnly: true,
        });
        response(res, "You are logout", 200);
    } catch (ex) {
        next(ex);
    }
})


export default router
