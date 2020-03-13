import Stripe from "stripe"
import uuidv4 from "uuid/v4"
import jwt from "jsonwebtoken"
import cookies from "nookies"
import Cart from "../../models/Cart"
import Product from "../../models/Product"
import Order from "../../models/Order"
import calculateCartTotal from "../../utils/calculateCartTotal"
import mongoose from "mongoose"

const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

export default async(req, res) => {
    const {paymentData} = req.body;
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        // 1. verify and get user info using token
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)     
        // 2. find car info using usedid and populate it
        const cart = await Cart.findOne({user : userId}).populate({
            path: "products.product",
            model: "Product"
        })
        // 3. Calculate Cart total against given payment Info
        const {cartTotal, stripTotal} = calculateCartTotal(cart.products)
        
        // 4. get Email from Payment info, and validate in Strip account
        const prevCustomer = await stripe.customers.list({
            email: paymentData.email,
            limit: 1
        })
        const isExistingCustomer = prevCustomer.data.length > 0;       
        // 5. if not, create a new customer account in Stripe
        let newCustomer;
        if(!isExistingCustomer) {
            newCustomer = await stripe.customers.create({
                email: paymentData.email,
                source: paymentData.id
            })
        }
        const customer = (isExistingCustomer && prevCustomer.data[0].id) || newCustomer.id
        // 6. create a charge amount and send receipt email
        const charge = await stripe.charges.create({
            currency: "usd",
            amount: stripTotal,
            receipt_email: paymentData.email,
            customer,
            description: `Checkout | {paymentData.email} | {paymentData.id}`
        }, {
            idempotency_key : uuidv4()
        })
        // 7. Add order data in database
        await new Order({
            user: userId,
            email: paymentData.email,
            total: cartTotal,
            products: cart.products

        }).save()
        // 8. Clear products in Cart
        await Cart.findOneAndUpdate(
            {_id : cart._id},
            {$set : {products: [] }}
        )
        // 9. send back 200 success response
        res.status(200).send("Checout Succesful")
    } catch (err) {
        console.error(err)
        res.status(500).send("Error duting Payment processing")
    }
}