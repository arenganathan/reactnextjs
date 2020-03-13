import connectDb from "../../utils/connectDb"
import axios from "axios"
import Order from "../../models/Order"
import Product from "../../models/Product"
import mongoose from "mongoose"
import jwt from "jsonwebtoken"


connectDb()

export default async(req, res) => {
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)

        const orders  = await Order.find({user: userId})
                        .sort({createdAt : "asc"})
                        .populate({
                            path: "products.product",
                            model: "Product"
                        })
        res.status(200).json({orders})
    } catch (err) {
        console.error("Error during Order retrieval API", err)
        res.status(403).send("Error during Order retrieval API")
    }
    
}