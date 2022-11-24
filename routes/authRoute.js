import express from "express"
import User from "../models/User";


const router = express.Router()


router.post("/generate-token", async function (req, res){
    const email = req.params.email
    let user = await (await User.collection).findOne({email: email})

    if(user){
        // generate token
    } else {
        // create user and generate token
    }


})



export default router
