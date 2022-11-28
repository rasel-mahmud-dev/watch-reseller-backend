import express from "express"

// This is your test secret API key.
const stripe = require("stripe")(process.env["STRIPE_SECRET_KEY"]);

import Advertise from "../models/Advertise";
import Payment from "../models/Payment";
import {ObjectId, Transaction} from "mongodb";
import auth from "../middlewares/auth";
import response from "../response";
import Product from "../models/Product";
import Order from "../models/Order";
import role from "../middlewares/role";

const router = express.Router()

router.get("/transactions", auth, async (req, res, next) => {
    try {
        let payments = await Payment.find({})
        response(res, payments, 200)
    } catch (ex) {
        next(ex)
    }
})

router.get("/transactions/:buyerId", auth, role(["BUYER"]), async (req, res, next) => {
    try {
        let payments = await Payment.find({buyerId: new ObjectId(req.params.buyerId)})
        response(res, payments, 200)
    } catch (ex) {
        next(ex)
    }
})

router.post("/create-payment-intent", auth, async (req, res, next) => {
    try {
        const {price} = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price, currency: "usd", "payment_method_types": ["card"]
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        return next(error)
    }
})

router.post("/pay", auth, async (req, res, next) => {
    try {

        const {
            productId, transactionId, orderId, price,
        } = req.body;

        // create a payment record in database
        let newPayment = new Payment({
            productId: new ObjectId(productId),
            orderId: new ObjectId(orderId),
            transactionId: transactionId,
            buyerId: new ObjectId(req.user.userId),
            buyerEmail: req.user.email,
            price
        })

        newPayment = await newPayment.save()
        if (!newPayment) {
            // should handle rollback money form stripe
            return response(res, "Payment Entry Fail", 500)
        }

        // set change order payment status
        let result = await Order.updateOne({_id: new ObjectId(orderId)}, {$set: {isPaid: true}})
        console.log(result)

        // change product sales status
        let productUpdated = await Product.updateOne({_id: new ObjectId(productId)}, {
            $set: {
                isSold: true
            }
        })


        // delete advertise if payment create successfully
        let advertiseDeletedResult = await Advertise.deleteOne({productId: new ObjectId(productId)})

        response(res, {message: "Payment Completed", payment: newPayment}, 201)


    } catch (error) {
        next(error)
    }
})

export default router