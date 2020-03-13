import Product from "../../models/Product"
import connectDb from "../../utils/connectDb"
import Cart from "../../models/Cart"
import Order from "../../models/Order"

connectDb()

export default async (req, res) => {
    switch (req.method) {
        case "GET" : 
            await handleGetRequest(req, res);
            break;
        case "POST" :
            await handlePostRequest(req, res)   
            break;
        case "DELETE" :
            await handleDeleteRequest(req, res)   
            break;
        default:
            res.status(405).send(`Method ${req.method} not allowed`);     
            break;    
    }
}

async function handleGetRequest(req, res) {
    const {_id} = req.query;    
    const product = await Product.findOne({_id});
    res.status(200).json(product);
}

async function handlePostRequest(req, res) {
    try {
        const {name, price, description, mediaUrl} = req.body;
        if(!name || !price || !description || !mediaUrl) {
            return res.status(422).send("Product missing one or more fields")
        };
        const product = await new Product({
            name,
            price,
            description,
            mediaUrl
        }).save();    
        res.status(201).json(product)
    } catch (err) {
        res.status(500).send("Server Error in creating Product")
        console.error("Server Error", err)
    }    
}

async function handleDeleteRequest(req, res) {
    const {_id} = req.query;
    try {        
        // 1) delete product by id
        await Product.findOneAndDelete({_id});
        // 2) delete product in all carts which is referenced as product
        await Cart.updateMany(
            {"products.product": _id},
            { $pull: {products: {product: _id}}}
        );
        await Order.updateMany(
            {"products.product": _id},
            { $pull: {products: {product: _id}}}
        );
        res.status(204).json({});
    } catch (err) {
        res.status(500).send("Server Error in deleting Product")    
    }
   
}
