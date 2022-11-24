import express from "express"
import User from "../models/User";
import {createToken} from "../jwt";
import response from "../response";


const router = express.Router()


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
        if(user){
            createToken( user._id, email)
            return response(res, { token, user }, 201)
        }

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
        return response(res, { token, user: newUser }, 201)

    } catch (ex) {
        next(ex)
    }
})



export default router
