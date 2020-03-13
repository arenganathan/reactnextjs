import mongoose from "mongoose"
import connectDb from "../../utils/connectDb"
import Cart from "../../models/Cart"
import Product from "../../models/Product"
import jwt from "jsonwebtoken"

connectDb()

const {ObjectId} = mongoose.Types

export default async (req, res) => {
    switch (req.method) {
        case "GET" : 
            await handleGetRequest(req, res);
            break;
        case "PUT" :
            await handlePutRequest(req, res)   
            break;
        case "DELETE" :
            await handleDeleteRequest(req, res)   
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);     
            break;    
    }
}

async function handlePutRequest (req, res) {
    const {quantity, productId} = req.body;
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)        
        // 1. find user cart basd on UserId
        const cart = await Cart.findOne({user : userId})
        // 2. check if product is already exists
        const productExist = cart.products.some(doc => ObjectId(productId).equals(doc.product))
        // 3. if product exists, update the quantity 
        if (productExist) {
            await Cart.findOneAndUpdate(
                { _id: cart._id, "products.product": productId },
                { $inc: {"products.$.quantity" : quantity }}
            )
        } else { // 4. else.. add new product with given quantity 
            const newProduct = {quantity, product: productId}
            await Cart.findOneAndUpdate(
                { _id: cart._id},
                { $addToSet : {products : newProduct}}
            )
        } 
        res.status(200).send("Cart Updated")
    } catch (err) {
        console.error("Error during cart API PUT request",err)
        res.status(500).send("Error during cart API PUT request")
    }
}

async function handleDeleteRequest (req, res) {
    
    const {productId} = req.query    
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)        
        const cart = await Cart.findOneAndUpdate(
            { user : userId},
            { $pull : {products : {product : productId}}},
            { new : true }
        ).populate({
            path: "products.product",
            model: "Product"
        })
        res.status(200).json(cart.products)
    } catch (err) {
        console.error("Error during cart API DELETE request",err)
        res.status(500).send("Error during cart DELETE GET request")
    }
}


async function handleGetRequest (req, res) {
    if(!("authorization" in req.headers)) {
        return res.status(401).send("No Authorization token found")
    }
    try {
        const {userId} = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        const cart = await Cart.findOne({user : userId}).populate({
            path: "products.product",
            model: "Product"
        })
        res.status(200).json(cart.products)
    } catch (err) {
        console.error("Error during cart API GET request",err)
        res.status(500).send("Error during cart API GET request")
    }
}