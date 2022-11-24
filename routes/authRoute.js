import express from "express"
import User from "../models/User";
import {createToken, parseToken} from "../jwt";
import response from "../response";
import getCookie from "../utils/getCookie";


const router = express.Router()

let cookieExpirationDate = new Date(Date.now() + 1000 * 3600 * 24 * 7); // 7 days

router.post("/generate-token", async function (req, res, next){
    const {
        googleId,
        firstName,
        lastName,
        avatar,
        role="BUYER",
        phone,
        email,
        location,
    } = req.body

    try{
        let user = await (await User.collection).findOne({email: email})
        let token = ""
        if(!user){
            let newUser = new User({
                email,
                googleId,
                firstName,
                lastName,
                avatar,
                role,
                phone,
                location,
            })

            newUser = await newUser.save();
            if(!newUser){
                return response(res, "User creation fail, Please try again", 403)
            }

            token = createToken( user._id, email)
        } else {
            token = createToken( user._id, email)
        }


        // send cookie in header to set client browser
        res.cookie("token", token, {
            domain: process.env.CLIENT,
            path: "/",
            secure: true,
            expires: cookieExpirationDate,
            httpOnly: true,
        });
        return response(res,  user, 201)

    } catch (ex) {
        next(ex)
    }
})


router.get("/validate-token", async function (req, res, next){
    try {
        let token = getCookie("token", req)
        if(!token){
            return response(res, "token not found", 401)
        }
        let data = await parseToken(token)
        response(res, data)

    } catch (ex){
        next(ex)
    }
})



export default router
