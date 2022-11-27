import express from "express"
import * as stripe from "stripe";
import Advertise from "../models/Advertise";
import Payment from "../models/Payment";
import {ObjectId} from "mongodb";
import auth from "../middlewares/auth";
import response from "../response";
import Product from "../models/Product";


const router = express.Router()

router.post("/create-payment-intent", auth, async (req, res, next)=>{
    try {

        const { items,  price,  } = req.body;

        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: price,
            items: items,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    } finally {
    }
})

router.post("/pay", auth, async (req, res, next)=>{
    try {

        const {
            productId,
            transactionId,
            orderId,
            price,
        } = req.body;

        // create a payment record in database
        let newPayment = new Payment({
            productId: new ObjectId(productId),
            orderId: new ObjectId(orderId),
            transactionId: new ObjectId(transactionId),
            buyerId: new ObjectId(req.user.userId),
            buyerEmail: req.user.email,
            price
        })

        newPayment = await newPayment.save()
        if(!newPayment){
            // should handle rollback money form stripe
            return response(res, "Payment Entry Fail", 500)
        }

        // change product sales status
        let productUpdated  = await Product.updateOne({_id: new ObjectId(productId)}, {
            $set: {
                isSold: true
            }
        })


        // delete advertise if payment create successfully
        let advertiseDeletedResult = await Advertise.deleteOne({productId: new ObjectId(productId)})

        response(res, {message: "Payment Completed", payment: newPayment})


    } catch (error) {
        next(error)
    }
})

export default router