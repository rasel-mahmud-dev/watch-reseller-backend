import express from "express"
import User from "../models/User";
import {createToken, parseToken} from "../jwt";
import response from "../response";
import getToken from "../utils/getToken";
import auth from "../middlewares/auth";
import role from "../middlewares/role";
import Order from "../models/Order";
import {ObjectId} from "mongodb";
import Product from "../models/Product";


const router = express.Router()



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
            // if (!isEntry) {
            //     token = createToken(newUser._id, role, email)
            // }
        } else {
            // update existing user
            let updateUser = {}
            if (firstName) updateUser.firstName = firstName
            if (lastName) updateUser.lastName = lastName
            if (googleId) updateUser.googleId = googleId
            if (username) updateUser.username = username
            if (avatar) updateUser.avatar = avatar
            if (phone) updateUser.phone = phone
            if (location) updateUser.location = location
            if (address) updateUser.address = address

            let updatedResult = await userCollection.updateOne(
                {email: email}, {$set: updateUser}
            )

            // if (!isEntry) {
            //     token = createToken(user._id, user.role, email)
            // }
        }

        token = createToken(user._id, user.role, email)

        return response(res, {user, token}, 201)

    } catch (ex) {
        next(ex)
    }
})


router.get("/get-current-user", auth, async function (req, res, next) {
    try {
        let user = await User.findOne({email: req.user.email})
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
        let token = getToken( req)
        if (!token) {
            return response(res, "token not found", 401)
        }
        let data = await parseToken(token)
        response(res, data)

    } catch (ex) {
        next(ex)
    }
})


router.get("/logout", async function (req, res, next) {
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


// get all buyers for a seller user
router.get("/seller-buyers", auth, role(["SELLER"]), async function (req, res, next) {
    try {

        let buyers = await (await Order.collection).aggregate([
            {
                $match: {sellerId: new ObjectId(req.user.userId)},
            },

            // find unique seller
            {
                $group: {
                    _id: "$sellerId",
                }
            },
            // lookup from users collection
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {$unwind: {path: "$user", preserveNullAndEmptyArrays: true}},
            // only select necessary field
            {
                $project: {
                    username: "$user.username",
                    avatar: "$user.avatar",
                    email: "$user.email",
                    isVerified: "$user.isVerified",
                    createdAt: "$user.createdAt",
                }
            }
        ]).toArray();

        response(res, buyers, 200)

    } catch (ex) {
        next(ex);
    }
})


// get all buyers for a admin role user
router.get("/buyers", auth, role(["ADMIN"]), async function (req, res, next) {
    try {
        let buyers = await (await User.collection).find({role: "BUYER"}).toArray();
        response(res, buyers, 200)

    } catch (ex) {
        next(ex);
    }
})



// get all seller for a admin
router.get("/sellers", auth, role(["ADMIN"]), async function (req, res, next) {
    try {

        let sellers = await (await User.collection).find({role: "SELLER"}).toArray();
        response(res, sellers, 200)

    } catch (ex) {
        next(ex);
    }
})



// verify as seller by admin
router.patch("/seller-verify", auth, role(["ADMIN"]), async function (req, res, next) {
    try {
        const {sellerId, verifyStatus} = req.body

        let isUpdate = await User.updateOne(
            {_id: new ObjectId(sellerId)},
            {$set: { isVerified: verifyStatus }}
        )

        response(res, "Update", 201)

    } catch (ex) {
        next(ex);
    }
})


// verify as seller by admin
router.delete("/seller-delete/:sellerId", auth, role(["ADMIN"]), async function (req, res, next) {
    try {
        const {sellerId} = req.params

        let deleted = await User.deleteOne(
            {_id: new ObjectId(sellerId)}
        )
        if(!deleted) {
            return response(res, "Seller delete fail", 500)
        }

        //also delete seller products
        let deleteProduct  = await (await Product.collection).deleteMany({sellerId: new ObjectId(sellerId)})
        console.log(deleteProduct)



        response(res, "Seller deleted", 201)

    } catch (ex) {
        next(ex);
    }
})


// delete buyer
router.delete("/buyer-delete/:buyerId", auth, role(["ADMIN"]), async function (req, res, next) {
    try {
        const {buyerId} = req.params

        let deleted = await User.deleteOne(
            {_id: new ObjectId(buyerId)}
        )
        if(!deleted) {
            return response(res, "Buyer delete fail", 500)
        }

        //also delete buyer all orders
        await (await Order.collection).deleteMany({buyerId: new ObjectId(buyerId)})

        response(res, "Buyer deleted", 201)

    } catch (ex) {
        next(ex);
    }
})


export default router
